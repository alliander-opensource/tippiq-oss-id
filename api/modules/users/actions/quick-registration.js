/**
 * Response handler for quick registration.
 * @module users/actions/quick-registration
 */

import debugLogger from 'debugnyan';
import superagent from 'superagent';
import BPromise from 'bluebird';

import config from '../../../config';
import auth from '../../auth';
import { UserRepository } from '../repositories';
import { ValidationError, EmailExistsError } from '../../../common/errors';
import { validateEmail } from '../user-validation';
import { QUICK_REGISTRATION } from '../../auth/permissions';
import { validatePermissions, getSignedJwt } from '../../auth/auth';
import { AttributeRepository } from '../../attributes/repositories';
import { startEmailVerificationForUser } from '../user-email-verification';

const debug = debugLogger('tippiq-id:users:actions:quick-registration');

/**
 * Response handler for registration.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  let placeToken;
  let accessToken;
  const { email, trackingCode, placeAddress, placeAddressForEmail, policies, clientId } = req.body;
  debug.debug('Place address email', req.body);
  validatePermissions(req, res, QUICK_REGISTRATION)
    .then(() => ({
      email,
    }))
    .tap(user => validateEmail(user.email))
    .then(UserRepository.create)
    .tap(user => startEmailVerificationForUser(
      user, `${config.tippiqHoodBaseUrl}/mijn-buurt?track=${trackingCode}`,
      false, {
        additionToTemplateName: 'quick-start',
        placeAddressForEmail,
        policies,
        from: config.emailFromPlacesAddress,
      }))
    .then(user => user.get('id'))
    .then(userId =>
      getSignedJwt({ action: 'tippiq_places.quick-registration' }, { audience: config.jwtAudiencePlaces })
        .then(tippiqServiceToken =>
          superagent
            .post(`${config.tippiqPlacesBaseUrl}/api/quick-registration`)
            .set('Authorization', `Bearer ${tippiqServiceToken}`)
            .set('Content-Type', 'application/json')
            .send({
              userId,
              placeAddress,
              policies,
            })
        )
        .then(result => {
          placeToken = result.body.placeToken;
          accessToken = result.body.accessToken;
          return auth.decodeJWT(placeToken);
        })
        .then(place => {
          AttributeRepository.create({
            userId,
            label: 'Mijn huis',
            data: {
              type: 'place_key',
              token: placeToken,
              placeId: place.placeId,
            },
          });
          return {
            userId,
            placeId: place.placeId,
          };
        })
    )
    .then(data => BPromise.all([
      auth.getJwtForUserId(data.userId, 'id'),
      auth.getJwtForUserId(data.userId, clientId, { placeId: data.placeId }),
    ]))
    .then(tokens => {
      res
        .cacheControl('no-store')
        .status(201)
        .json({
          success: true,
          idToken: tokens[0],
          hoodToken: tokens[1],
          accessToken,
        });
    })
    .catch(EmailExistsError, (err) => {
      debug.debug(`Email address in use error: ${err.message}`);
      res
        .status(412)
        .json({
          success: false,
          message: err.message,
          emailAddress: email,
        });
    })
    .catch(ValidationError, (err) => {
      debug.debug(`Validation error: ${err.message}`);
      res
        .status(400)
        .json({
          success: false,
          message: err.message,
        });
    })
    .catch((err) => {
      debug.debug(`Failed to register: ${err.message}`);
      res
        .status(400)
        .json({ success: false, message: 'Registratie mislukt.' });
    });
}
