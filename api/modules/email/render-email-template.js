/**
 * @module email/render-email-template
 */

import debugLogger from 'debugnyan';
import path from 'path';
import { EmailTemplate } from 'email-templates';
import ExtendableError from 'es6-error';
import config from '../../config';

const debug = debugLogger('tippiq-id:email:render');
const templateDir = path.join(__dirname, 'templates');
/**
 * Error thrown when an email template cannot be rendered
 */
export class RenderError extends ExtendableError {}

/**
 * Render the named template using the given data
 * @param {string} templateName Name of the subdirectory in this modules template directory
 * @param {Object} data To render the template with
 * @returns {Promise<EmailTemplate>} Prerendered email template
 */
export default
function renderEmailTemplate(templateName, data) {
  const templatePath = path.join(templateDir, templateName);
  const templateData = { ...data,
    frontendTippiqBaseUrl: config.tippiqBaseUrl,
    frontendTippiqPlacesBaseUrl: config.tippiqPlacesBaseUrl,
    frontendTippiqIdBaseUrl: config.frontendBaseUrl,
  };
  return new EmailTemplate(templatePath)
    .render(templateData)
    .catch((e) => {
      debug.debug(e);
      throw new RenderError(`Unable to render template ${templatePath}`);
    });
}
