/**
 * Functions to render and send email.
 * @module email
 * @example
 * renderEmailTemplate('registration-confirmation', {
 *   frontendBaseUrl: config.frontendBaseUrl,
 * })
 * .then(emailTemplate =>
 * ({
 *          from: config.emailFromAddress,
 *          to: [user.email],
 *          subject: 'Bedankt voor je registratie bij Tippiq',
 *          text: emailTemplate.text,
 *          html: emailTemplate.html,
 *        })
 * )
 * .then(sendEmail)
 */

import routes from './email-routes';

export renderEmailTemplate from './render-email-template';
export sendEmail from './send-email';
export Email from './email';

export default {
  routes,
};
