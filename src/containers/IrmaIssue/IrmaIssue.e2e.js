import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import superagent from 'superagent';

import config from '../../../api/config';
import { irmaApiMockServer, qrIssueJson } from '../../../api/common/irma-api-mock-server';
import { IrmaIssueTokenRepository } from '../../../api/modules/irma/repositories';
import { UserRepository } from '../../../api/modules/users/repositories';
import { page as loginPage } from '../Login/Login.e2e';

const API_USERS_REGISTRATION_URL = '/users/registration';
const userJson = {
  email: 'irmauser@test.com',
  password: '8OO!gyxFR9qqB&We',
};

export const page = {
  open: () => {
    loginPage.open();
    browser.wait(loginPage.isLoaded(), 10000);
    loginPage.emailField().sendKeys(userJson.email);
    loginPage.passwordField().sendKeys(userJson.password);
    loginPage.submit();

    browser.wait(loginPage.isLoaded(), 10000);

    browser.get('/irma-issue');
    browser.wait(page.isLoaded(), 100000);
  },
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-irma-issue'))),
  isIssued: () => protractor.ExpectedConditions.presenceOf(element(by.id('success-message'))),
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
function postIrmaSuccessStatus() {
  const irmaJwtStatus = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpcm1hX3N0YXR1cyIsImV4cCI6MzM3NDA' +
             '1MjYzOSwiaWF0IjoxNDgwNTk2NjM5LCJzdGF0dXMiOiJET05FIn0.zpVF7AhzZSa' +
             'uB_bKOHAyHhNkm-0BvX11XIMzG0DgrJIZnYDWXydyR_hpA6Jlo433G7PZY43J0BW' +
             '7AhAExvJPQIfCTfrmKRwU1PvhGXBiIzHfm-zKebyPM_d5D20_xGIIeKaEmV1_M6W' +
             'qHlU2oozz1gMJbedjT_S7iHVRgaXwXGHfOBa2ungc91dH6cLUL62XCGRAsGjwclH' +
             '7X-ucAbSAUWtAicUgXCrjtfr799CXWV5J7lJfaUjDMX8F6bIXEgGWmJYQzMkv8in' +
             'R49x4TN4bcn9ZCNUlSh9fOKvfJrByUhIZl1CzRK0Hl9OHvWtjCPG_Yr0tdTfX5ip' +
             'urF2bKtb9Ng';

  return new Promise((resolve, reject) => {
    const request = superagent.post(`${config.frontendBaseUrl}/api/irma/complete-tippiqid-issue-request/${qrIssueJson.u}`);
    request.type('text/plain');
    request.send(irmaJwtStatus);
    request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
  });
}

xdescribe('Irma issue container', () => { // keeps failing randomly
  beforeAll(() => irmaApiMockServer.start());
  beforeAll(() =>
    superagent
      .post(`${config.frontendBaseUrl}/api/${API_USERS_REGISTRATION_URL}`)
      .send(userJson)
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(user => user.set('emailIsVerified', true).save())
  );

  afterAll(() => irmaApiMockServer.stop());
  afterAll(() =>
    IrmaIssueTokenRepository
      .findOne({ session_token: qrIssueJson.u })
      .then(record => record.destroy())
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(user => user.destroy())
  );

  it('shows a QR code that has been retrieved from the backend', () => {
    page.open();
    expect(page.heading()).toEqual('IRMA bij Tippiq');

    return page.qrToken()
      .then(token => parseQr(token))
      .then(parsedQr =>
        expect(parsedQr).toEqual(JSON.stringify({
          u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/issue/${qrIssueJson.u}`,
          v: qrIssueJson.v,
          vmax: qrIssueJson.vmax,
        }))
      )
      .then(() => postIrmaSuccessStatus()) // Post to callback url
      .then(() => browser.wait(page.isIssued(), 10000));
  });
});
