/**
 * Handler to start the email testing process.
 * @module modules/email/actions/generate-test-mail
 */

import debugLogger from 'debugnyan';

import BPromise from 'bluebird';
import config from '../../../config';
import { renderEmailTemplate, sendEmail } from '../../email';
import { AuthenticationError } from '../../../common/errors';
import { GENERATE_TEST_EMAILS } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';

const debug = debugLogger('tippiq-id:email:actions:generate-test-emails');

/**
 * Response handler for notification emails
 * @param {string} template The directory name of the template is used for the template name.
 * @param {string} subject The subject of the email.
 * @param {string} to The email address that receives the email
 * @returns {Promise} A promise which resolves the email
 * @private
 */
function sendNotificationEmail(template, subject, to) {
  const emailTemplatePromise = renderEmailTemplate(template, {});

  return emailTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [to],
        subject: `Test - ${subject}`,
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send '${subject}' email: ${err.message}`);
    });
}

/**
 * Response handler for policies emails
 * @param {string} template The directory name of the template is used for the template name.
 * @param {string} subject The subject of the email.
 * @param {string} to The email address that receives the email
 * @returns {Promise} A promise which resolves the email
 * @private
 */
function sendPoliciesEmail(template, subject, to, policies = [
  { title: '3P mag mijn slimme meter uitlezen.' },
  { title: '3P mag informatie over mijn energiegebruik anoniem delen met mijn community.' },
]) {
  const emailTemplatePromise = renderEmailTemplate(template, {
    serviceName: '3P',
    policies,
  });

  return emailTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [to],
        subject: `Test - ${subject}`,
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send '${subject}' email: ${err.message}`);
    });
}

/**
 * Response handler for registration.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  let to = 'test@test.com';
  if (req.query.email) {
    to = req.query.email;
  }

  validatePermissions(req, res, GENERATE_TEST_EMAILS)
    .then(() =>
      BPromise.all([
        sendNotificationEmail('password-changed', 'Wachtwoord gewijzigd', to),
        sendNotificationEmail('registration-confirmation',
          'Bedankt voor je registratie bij Tippiq', to),
        sendNotificationEmail('request-request-reset-password', 'Wachtwoord vergeten', to),
        sendNotificationEmail('simple-registration-confirmation',
          'Bedankt voor je registratie bij Tippiq', to),
        sendPoliciesEmail('policies-set', 'Je ingestelde huisregels', to),
        sendPoliciesEmail('policies-set', 'Je ingestelde huisregels', to, []),
      ])
    )
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: 'Bericht verstuurd.' });
    })
    .catch(AuthenticationError, (e) => {
      debug.debug(e);
      res
        .status(400)
        .json({
          success: false,
          message: 'Validatiefout: Ongeldig token.',
        });
    })
    .catch((e) => {
      debug.debug(`Failed to send test emails: ${e.message}`);
      res
        .status(500)
        .json({
          success: false,
          message: 'Versturen van test e-mails mislukt.',
        });
    });
}
