/**
 * Passport Strategies
 * @module auth/strategies
 */
import jwt from './jwt';
import tippiqServiceJwt from './tippiqServiceJwt';
import tippiqPlacesServiceJwt from './tippiqPlacesServiceJwt';
import oauth2ClientStrategy from './oauth2-client-strategy';

export default {
  jwt,
  tippiqServiceJwt,
  tippiqPlacesServiceJwt,
  oauth2ClientStrategy,
};
