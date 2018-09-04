import secureRandomString from 'secure-random-string';

import { page as registerPage } from '../Register/Register.e2e';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-change-username'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('userNameSubmitButton')).click(),
  userNameField: () => element(by.id('userName')),
  result: () => element(by.id('successMessage')),
};

describe('Change username container', () => {
  it('should set a new username', () => {
    // Register user to create token
    registerPage.open();

    registerPage.emailField().sendKeys(`${secureRandomString()}@example.com`);
    registerPage.passwordField().sendKeys('test1234ABC');
    registerPage.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(registerPage.result()), 10000);

    // Change username
    browser.get('/mijn-account/naam');

    browser.wait(page.isLoaded(), 10000);
    expect(page.heading()).toEqual('Naam wijzigen');

    // Check submit
    page.userNameField().sendKeys('It\'s a me Mario!');
    page.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(page.result()), 10000);

    expect(page.result().getText()).toEqual('Gelukt! Je naam is opgeslagen.');
  });
});
