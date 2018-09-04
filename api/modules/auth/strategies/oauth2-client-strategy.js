/**
 * Basic authentication Strategy.
 * @module modules/auth/strategies/basic
 */

import { BasicStrategy } from 'passport-http';

import { OAuth2ClientRepository } from '../../oauth2/repositories';

export default new BasicStrategy((userid, password, done) => {
  OAuth2ClientRepository
    .findOne({
      client_id: userid,
      client_secret: password,
    })
    .then(client => client.related('owner'))
    .asCallback(done);
});
