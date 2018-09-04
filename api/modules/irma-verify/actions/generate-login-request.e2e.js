import { IrmaSessionTokenRepository } from '../../irma/repositories';
import { app, expect, request } from '../../../common/test-utils';
import config from '../../../config';
import { irmaApiMockServer, qrVerifyJson } from '../../../common/irma-api-mock-server';

const API_IRMA_LOGIN_URL = '/irma/generate-login-request';

describe('Generate IRMA login request', () => {
  before(() => {
    irmaApiMockServer.start();
  });

  after(() => {
    irmaApiMockServer.stop();
    return IrmaSessionTokenRepository.deleteBySessionToken(qrVerifyJson.u);
  });

  it('should return a valid IRMA session token', () =>
    request(app)
      .get(API_IRMA_LOGIN_URL)
      .expect(201)
      .then(response => response.toJSON().text)
      .then(jsonResponse => expect(jsonResponse).to.deep.equal(JSON.stringify({
        qr: {
          u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/verification/${qrVerifyJson.u}`,
          v: qrVerifyJson.v,
          vmax: qrVerifyJson.vmax,
        },
        token: qrVerifyJson.u,
      })))
  );
});
