/**
 * Local SMTP
 * @module modules/email/transporters/local-smtp
 */
import nodemailer from 'nodemailer';
import nodemailerSmtpTransport from 'nodemailer-smtp-transport';

const config = require('../../../config');

/**
 * Create a nodemailer Transport configured against a local smtp server.
 * @returns {Transport} local smtp transport
 */
export default
function getTransporter() {
  const smtpTransporter = nodemailerSmtpTransport({
    host: config.localSmtpHost,
    ignoreTLS: true,
    port: config.localSmtpPort,
  });

  return nodemailer.createTransport(smtpTransporter);
}
