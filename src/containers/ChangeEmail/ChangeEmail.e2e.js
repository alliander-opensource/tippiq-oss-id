import secureRandomString from 'secure-random-string';

import { page as registerPage } from '../Register/Register.e2e';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-change-email'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('emailSubmitButton')).click(),
  emailField: () => element(by.id('email')),
  emailError: () => element(by.id('email'))
    .element(by.xpath('following-sibling::div')).getText(),
  emailVerificationButton: () => element(by.id('email-verification-button')).getText(),
  result: () => element(by.id('successMessage')),
};

describe('Change email container', () => {
  it('should show form', () => {
    // Register user to create token
    registerPage.open();

    registerPage.emailField().sendKeys(`${secureRandomString()}@example.com`);
    registerPage.passwordField().sendKeys('test1234ABC');
    registerPage.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(registerPage.result()), 10000);

    // Change email
    browser.get('/mijn-account/email');

    browser.wait(page.isLoaded(), 10000);
    expect(page.heading()).toEqual('E-mailadres wijzigen');
  });

  it('should fail with empty email', () => {
    // Check required field
    page.emailField().clear();
    page.submit();
    expect(page.emailError()).toEqual('Verplicht');
  });

  it('should fail with incorrect email', () => {
    // Check valid email format
    page.emailField().sendKeys('not-an-email');
    page.submit();
    expect(page.emailError()).toEqual('Incorrect e-mailadres');
  });

  it('should set a new email', () => {
    // Check submit
    page.emailField().sendKeys(`${secureRandomString()}@example.com`);
    page.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(page.result()), 10000);
    expect(page.result().getText()).toEqual('Gelukt! Je e-mailadres is opgeslagen.');
  });

  it('should show email verification button', () => {
    expect(page.emailVerificationButton()).toEqual('Mijn e-mailadres verifiëren');
  });
});
