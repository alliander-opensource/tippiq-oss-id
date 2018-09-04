import secureRandomString from 'secure-random-string';

import { page as registerPage } from './../Register/Register.e2e';
import config from '../../../api/config';

const redirectUri = encodeURIComponent(`${config.frontendBaseUrl}/mijn-account/naam`);
const decodedRedirectUri = decodeURIComponent(redirectUri);

describe('Get session container', () => {
  it('redirects to the redirect uri with the session token', () => {
    // Register user to create token
    registerPage.open();

    registerPage.emailField().sendKeys(`${secureRandomString()}@example.com`);
    registerPage.passwordField().sendKeys('test1234ABC');
    registerPage.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(registerPage.result()), 10000);

    // Get session
    browser.get(`/get-session?redirect_uri=${redirectUri}`);
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css('h1'))), 10000);

    expect(browser.driver.getCurrentUrl()).toEqual(decodedRedirectUri);
  });
});
