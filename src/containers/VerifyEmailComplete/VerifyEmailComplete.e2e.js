import secureRandomString from 'secure-random-string';

import { page as registerPage } from '../Register/Register.e2e';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(
    element(by.id('page-verify-email-complete'))),
  result: () => element(by.id('verify-email-success')),
  error: () => element(by.css('.text-danger')),
};

describe('Verify email complete container', () => {
  it('should fail for an invalid token', () => {
    // Register user to create token
    registerPage.open();

    registerPage.emailField().sendKeys(`${secureRandomString()}@example.com`);
    registerPage.passwordField().sendKeys('test1234ABC');
    registerPage.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(registerPage.result()), 10000);

    // Get session
    browser.get('/email-bevestigd?token=invalid-token');
    browser.wait(page.isLoaded(), 10000);

    expect(page.error().getText()).toEqual('Ongeldig token, vraag e-mail verificatie opnieuw aan.');
  });
});
