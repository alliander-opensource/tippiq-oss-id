import { waitUntilURLIsLoaded } from '../../../test/testHelper';
import config from '../../../api/config';

import { insertTestData, removeTestData } from '../../../api/common/seed-utils';

export const page = {
  open: () => {
    browser.get('/login');
    browser.wait(page.isLoaded(), 10000);
  },
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-login'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.css('.btn-primary')).click(),
  emailField: () => element(by.id('email')),
  passwordField: () => element(by.id('password')),
  emailError: () => element(by.id('email')).element(by.xpath('following-sibling::div')).getText(),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  resultFailed: () => element(by.css('.alert-danger')),
};

describe('Login container', () => {
  const redirectUri = encodeURIComponent(`${config.frontendBaseUrl}/mijn-account/naam`);

  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeEach(() => {
    browser.get(`/login?redirect_uri=${redirectUri}`);
    browser.wait(page.isLoaded(), 10000);
  });

  it('loads the login screen', () => {
    expect(page.heading()).toEqual('Inloggen met je Tippiq Account');
  });

  it('checks for required fields', () => {
    page.submit();
    expect(page.emailError()).toEqual('Verplicht');
    expect(page.passwordError()).toEqual('Verplicht');
  });

  it('does not login a user when wrong email password combo is provided', () => {
    page.emailField().sendKeys('login@test.com');
    page.passwordField().sendKeys('bla&1(bla');
    page.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(page.resultFailed()), 10000);
    expect(page.resultFailed().getText()).toEqual('E-mailadres of wachtwoord is onjuist.');
  });

  it('logs in a user when a valid email password combo is provided', () => {
    const decodedRedirectUri = decodeURIComponent(redirectUri);

    page.emailField().sendKeys('login@test.com');
    page.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    page.submit();

    waitUntilURLIsLoaded(browser, decodedRedirectUri);
    expect(browser.driver.getCurrentUrl()).toEqual(decodedRedirectUri);
  });
});
