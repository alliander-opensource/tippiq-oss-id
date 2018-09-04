import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import superagent from 'superagent';

import config from '../../../api/config';
import { irmaApiMockServer, qrVerifyJson } from '../../../api/common/irma-api-mock-server';
import { IrmaSessionTokenRepository } from '../../../api/modules/irma/repositories';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';

export const page = {
  open: () => {
    browser.get('/irma-login');
    browser.wait(page.isLoaded(), 100000);
  },
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-irma-login'))),
  isLoggedIn: () => protractor.ExpectedConditions.presenceOf(element(by.id('success-message'))),
  qrToken: () => element(by.className('react-qr')).getAttribute('src'),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.css('.btn-primary')).click(),
  emailField: () => element(by.id('email')),
  passwordField: () => element(by.id('password')),
  emailError: () => element(by.id('email')).element(by.xpath('following-sibling::div')).getText(),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  resultFailed: () => element(by.css('.alert-danger')),
};

/**
 * Parse a QR token back to text
 * @method parseQr
 * @paran qrToken base64 token to be parsed
 * @return Promise<string> text in the QR token
 */
function parseQr(qrToken) {
  const base64Qr = qrToken.split(',')[1];
  const binaryQr = new Buffer(base64Qr, 'base64');
  const png = new PNG();
  return new Promise((resolve) => {
    png.parse(binaryQr, (err, data) => {
      const result = jsQR.decodeQRFromImage(data.data, 255, 255);
      resolve(result);
    });
  });
}

/**
 * Post an IRMA proof to the backend (normally done by app)
 * @method postIrmaProof
 * @return Promise whether post has been succeeded or not
 */
function postIrmaProof() {
  const irmaJwtProof = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkaXNjbG9zdXJlX3Jlc3Vsd' +
                       'CIsImF0dHJpYnV0ZXMiOnsidGlwcGlxLlRpcHBpcS51c2VyLmUtbWF' +
                       'pbCI6InRlc3RAdGVzdC5jb20iLCJ0aXBwaXEuVGlwcGlxLnVzZXIua' +
                       'WQiOiI0ODE4MWFhMi01NjBhLTExZTUtYTFkNS1jNzA1MGM0MTA5YWI' +
                       'ifSwiZXhwIjozMzc0MTQxMTUzLCJpYXQiOjE0ODA2ODUxNTMsImp0a' +
                       'SI6InRpcHBpcV9sb2dpbl9yZXF1ZXN0Iiwic3RhdHVzIjoiVkFMSUQ' +
                       'ifQ.w9K-6Zxx_AxFyJ1__4ohdZfuDZbaw-fs07muHHGyF0gCFEZpof' +
                       '0NFjJ9RLWGdCJZLeHuFTsNLIvMn_qhoipnYL0nJKc_dcTIggwqQpH8' +
                       '3mjE6WoErzh7y84Pry6350YQ_U-DXzevSeeC1nymT1zYmDWOm63Qji' +
                       '0a5lWFIXXN-yIVKzqEZNFNYdzxjwgd4w35HB0UAfnyB5HbX17_xfbd' +
                       'Z-wToWJeKqZA4iZly7gEAmsWWn-zRvI_9xx7lK9-2XMvSqHtiAhU-W' +
                       'Xo5D733TyJ3frrbYIUdKrU7CosOIA-ThCat90jyQu4Cs-yqlqe0iQJ' +
                       'Csz10DXfbUytpwb9ogdYxQ';

  return new Promise((resolve, reject) => {
    const request = superagent.post(`${config.frontendBaseUrl}/api/irma/complete-login-request/${qrVerifyJson.u}`);
    request.type('text/plain');
    request.send(irmaJwtProof);
    request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
  });
}

describe('Irma Login container', () => {
  beforeAll(() => insertTestData());
  beforeAll(() => irmaApiMockServer.start());

  beforeEach(page.open);

  afterAll(() => irmaApiMockServer.stop());
  afterAll(() => IrmaSessionTokenRepository.deleteBySessionToken(qrVerifyJson.u));
  afterAll(() => removeTestData());

  it('shows a QR code that has been retrieved from the backend', () => {
    expect(page.heading()).toEqual('Inloggen bij Tippiq');

    return page.qrToken()
    .then(token => parseQr(token))
    .then(parsedQr =>
      expect(parsedQr).toEqual(JSON.stringify({
        u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/verification/${qrVerifyJson.u}`,
        v: qrVerifyJson.v,
        vmax: qrVerifyJson.vmax,
      }))
    )
    .then(() => postIrmaProof()) // Post to callback url
    .then(() => browser.wait(page.isLoggedIn(), 10000));
  });
});
