/**
 * @class Email
 */
import debugLogger from 'debugnyan';

import { renderEmailTemplate, sendEmail } from './index';

const debug = debugLogger('tippiq-id:email:Email');

/**
 * Render and send email
 * @class Email
 */
export default class Email {
  /**
   * Setup an instance of the Email class
   * @param {string} name Selects the template to be rendered.
   * @param {string} emailFromAddress Which will be used as From address.
   * @param {string} subject Subject string for the emails.
   * @param {Object} [data] If present, an EmailTemplate will be prerendered.
   */
  constructor(name, emailFromAddress, subject, data) {
    this.name = name;
    this.emailFromAddress = emailFromAddress;
    this.subject = subject;
    if (typeof data !== 'undefined') {
      this.preparedEmailTemplate = renderEmailTemplate(name, data);
    }
  }

  /**
   * Returns the prepared EmailTemplate or creates a new one.
   * @param {Object} [data] If present, an EmailTemplate will be prerendered.
   * @returns {Promise<EmailTemplate>} EmailTemplate that can be used to send email.
   */
  getEmailTemplate(data) {
    return this.preparedEmailTemplate ?
      this.preparedEmailTemplate :
      renderEmailTemplate(this.name, data);
  }

  /**
   * Send email.
   * @param {string} emailAddress Receiver email address.
   * @param {Object} data Optional data to be merged into the template.
   * @returns {undefined}
   */
  send(emailAddress, data) {
    return this.getEmailTemplate(data)
      .then(emailTemplate =>
        ({
          from: this.emailFromAddress,
          to: [emailAddress],
          subject: this.subject,
          text: emailTemplate.text,
          html: emailTemplate.html,
        })
      )
      .then(sendEmail)
      .catch((err) => {
        debug.warn(`Failed to send '${this.name}' email: ${err.message}`);
        throw err;
      });
  }
}
