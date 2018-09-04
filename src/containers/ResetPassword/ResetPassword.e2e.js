import secureRandomString from 'secure-random-string';

import { page as registerPage } from '../Register/Register.e2e';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-reset-password'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('passwordSubmitButton')).click(),
  passwordField: () => element(by.id('password')),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  result: () => element(by.id('successMessage')),
  residentTitle: () => element(by.css('.resident-title')).getText(),
};

describe('Reset password container', () => {
  const randomString = secureRandomString();
  it('should set a new password', () => {
    // Register user to create token
    registerPage.open();

    registerPage.emailField().sendKeys(`${randomString}@example.com`);
    registerPage.passwordField().sendKeys('test1234ABC');
    registerPage.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(registerPage.result()), 10000);

    // Reset password
    browser.get('/nieuw-wachtwoord-instellen');
    browser.wait(page.isLoaded(), 10000);
    expect(page.heading()).toEqual('Nieuw wachtwoord instellen');

    // Check required field
    page.submit();
    expect(page.passwordError()).toEqual('Verplicht');

    // Check submit
    page.passwordField().sendKeys('test1234ABC');
    page.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(page.result()), 10000);
    expect(page.result().getText()).toEqual('Gelukt! Je nieuwe wachtwoord is opgeslagen.');

    // Check user is logged in
    expect(page.residentTitle().getText()).toEqual(`${randomString.substring(0, 17)}...`);
  });
});
