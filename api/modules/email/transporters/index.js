/**
 * @module modules/email/transporters
 */
import config from '../../../config';
import localSMTPTransporter from './local-smtp';
import amazonSESTransporter from './amazon-ses';

/**
 * Select and configure an email transporter.
 * @returns {Object} Email transporter
 */
export default
function transporter() {
  switch (config.mailTransporter) {
    case 'amazon-ses':
      return amazonSESTransporter();
    case 'local-smtp':
    /* falls through */
    default:
      return localSMTPTransporter();
  }
}
