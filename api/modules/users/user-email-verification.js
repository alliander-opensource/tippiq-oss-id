/**
 * @module users/user-email-verification
 */

import { get } from 'lodash';
import { emailFromAddress, tippiqHoodBaseUrl } from '../../config';
import { Email } from '../email';
import { ValidationError } from '../../common/errors';
import { UserRepository } from './repositories';
import {
  verifyJWT,
  getEmailVerificationJwtForUserId,
  ACTIONS,
} from '../auth/auth';

const emailVerificationComplete = new Email(
  'email-verification-complete',
  emailFromAddress,
  'Je e-mailadres is nu bevestigd',
  { tippiqHoodBaseUrl },
);

/**
 * Update emailIsVerified field for the user and send a confirmation mail.
 * @param {string} token JWT token
 * @returns {Promise<EmailTransporterStatus|AuthenticationError>} Status of the sent mail.
 */
export function completeEmailVerificationWithToken(token) {
  return verifyJWT(token, ACTIONS.EMAIL_VERIFICATION)
    .get('sub')
    .then(UserRepository.findById)
    .tap((user) => {
      if (user.get('emailIsVerified')) {
        throw new ValidationError('Email is already verified.');
      }
    })
    .tap(user => user.set('emailIsVerified', true).save())
    .tap(user => emailVerificationComplete.send(user.get('email')));
}

/**
 * Send a mail to the Users email address to ask for verification.
 * @param {object} user User that will be asked to verify its email address.
 * @param {string} returnUrl Return url to navigate to when verification is complete.
 * @param {string} reminder Whether to send verification reminder or default.
 * @param {object} options Optional options to process
 * @returns {Promise<EmailTransporterStatus>} Status of the sent mail.
 */
export function startEmailVerificationForUser(user, returnUrl, reminder, options) {
  const additionToTemplateName = get(options, 'additionToTemplateName', '');
  const policies = get(options, 'policies', false);
  const placeAddressForEmail = get(options, 'placeAddressForEmail', '');

  let template = `email-verification-${reminder ? 'reminder-' : ''}`;
  template = (additionToTemplateName !== '') ?
    `${template}${additionToTemplateName}` : `${template}start`;

  const email = new Email(template,
    get(options, 'from', emailFromAddress),
    'Bevestig je e-mailadres',
  );

  return getEmailVerificationJwtForUserId(user.get('id'))
    .then(token =>
      email.send(user.get('email'), {
        token,
        returnUrl,
        placeAddressForEmail,
        quickRegistration: additionToTemplateName,
        policies,
      })
    );
}
