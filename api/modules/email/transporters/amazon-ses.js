/**
 * Amazon SES
 * @module modules/email/transporters/amazon-ses
 */

import nodemailer from 'nodemailer';
import nodemailerSesTransport from 'nodemailer-ses-transport';

import config from '../../../config';

/**
 * Create a nodemailer Transport configured against a Amazon SES.
 * @returns {Transport} local smtp transport
 */
export default
function getTransporter() {
  const sesTransporter = nodemailerSesTransport({
    accessKeyId: config.sesAccessKeyId,
    secretAccessKey: config.sesAccessKeySecret,
    region: config.sesRegion,
  });

  return nodemailer.createTransport(sesTransporter);
}
