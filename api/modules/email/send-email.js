/**
 * @module email/send-email
 */

import BPromise from 'bluebird';
import debugLogger from 'debugnyan';
import uuid from 'uuid';
import { countBy, pick, isBoolean } from 'lodash';

import { QueuedEmail } from './models';
import transporter from './transporters';
import { sendMailSynchronousDefault } from '../../config';
import { knex } from '../../common/bookshelf';
import { ValidationError } from '../../common/errors';

const debug = debugLogger('tippiq-id:email:send-email');
const constants = Object.freeze({
  EVENTS: Object.freeze({
    EMAIL_QUEUED: 'email.email_queued',
    EMAIL_SENT: 'email.email_sent',
    EMAIL_NOT_SENT: 'email.email_not_sent',
  }),
  MAX_QUEUE_PROCESSING_BATCH_SIZE: 100,
  MAX_RETRIES_PER_EMAIL: 5,
});

/**
 * Sends email immediately
 * @param {object} email Email to send.
 * @param {string} [batchId] Id that identifies the batch, when omitted, 'no batch' is used in logs
 * @returns {object} Promise
 */
function sendEmailImmediately(email, batchId = 'no batch') {
  return transporter()
    .sendMail(email)
    .then(info => {
      debug.debug('%j', {
        info,
        success: true,
        batchId,
        email: pick(email, ['from', 'to', 'subject']),
      });
      return info;
    })
    .catch(err => {
      debug.warn('%j', {
        success: false,
        batchId,
        err,
        email: pick(email, ['from', 'to', 'subject']),
      });
      throw err;
    });
}

/**
 * Enqueue email
 * @param {object} email Email to send.
 * @returns {object} Promise
 */
function enqueueEmail(email) {
  return BPromise
    .try(() => {
      if (!Array.isArray(email.to)) {
        throw new ValidationError('email.to should be an Array');
      }
      return new QueuedEmail({ email }).save();
    });
}

/**
 * Send queued email
 * @param {object} queuedEmail Email object to send.
 * @returns {string} event that indicates if the email was sent or not
 */
function sendQueuedEmail(queuedEmail) {
  return sendEmailImmediately(queuedEmail.get('email'), queuedEmail.get('batchId'))
    .then(() =>
      queuedEmail
        .destroy()
        .return(constants.EVENTS.EMAIL_SENT)
    )
    .catch(e =>
      queuedEmail
        .save({
          last_error: e.message,
          retries: queuedEmail.get('retries') + 1,
          updated_at: new Date(),
          batch_id: null,
        })
        .return(constants.EVENTS.EMAIL_NOT_SENT)
    );
}

/**
 * Sends an email synchronously or asynchronously
 * @param {object} email Email to send.
 * @param {boolean} synchronous Whether to queue the email or send directly.
 * @returns {object} the EnqueuedEmail model if called with async is true.
 * @returns {object} the response from the email transporter if async is false.
 */
export default function sendEmail(email, synchronous = sendMailSynchronousDefault) {
  return BPromise
    .try(() => {
      let sendSynchronous = false;
      try {
        const isBool = JSON.parse(`${synchronous}`.toLowerCase());
        if (!isBoolean(isBool)) {
          throw new Error('Not a boolean');
        }
        sendSynchronous = isBool;
      } catch (error) {
        debug.warn(`Invalid value ${synchronous} for boolean value synchronous. Error: ${error}`);
      }
      if (sendSynchronous) {
        return sendEmailImmediately(email);
      }
      return enqueueEmail(email)
        .tap(queuedEmail => debug.debug(`constants.EVENTS.EMAIL_QUEUED ${queuedEmail.get('id')}`));
    });
}

/**
 * Process email queue
 * @param {string} batchId UUID of the batch to be processed
 * @param {number} batchSize Max number of emails to send
 * @param {number} maxRetries Max number times to retry sending an email
 * @returns {object} promise with the number of emails that failed
 */
export function processQueue(batchId = uuid.v4(),
                             batchSize = constants.MAX_QUEUE_PROCESSING_BATCH_SIZE,
                             maxRetries = constants.MAX_RETRIES_PER_EMAIL) {
  debug.info('%j', { batchId, batchSize, maxRetries });
  return knex('queued_email')
    .update({
      batch_id: batchId,
      updated_at: new Date(),
    })
    .whereIn('id', function QueueEmailBatch() {
      this
        .select('id')
        .from('queued_email')
        .whereNull('batch_id')
        .where('retries', '<', maxRetries)
        .orderBy('retries', 'asc')
        .orderBy('created_at', 'asc')
        .limit(batchSize);
    })
    .tap(numberOfItems => debug.debug('%j', { batchId, numberOfItems }))
    .then(() =>
      QueuedEmail.where('batch_id', batchId).fetchAll()
    )
    .then(emails => emails.models)
    .map(sendQueuedEmail)
    .then(countBy)
    .tap(result => debug.info('%j', { batchId, result }));
}
