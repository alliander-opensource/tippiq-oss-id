import { page as loginPage } from '../Login/Login.e2e';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import testUserAttributes from '../../../api/testdata/attributes';

import fake3pServiceProvider from '../../../api/testdata/fake3p-service-provider';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-place-key-select'))),
  heading: () => element(by.css('h1')).getText(),
  placeKeyList: () => element(by.id('list-place-keys')),
  placeKey1: () => element(by.id(testUserAttributes[0].id)),
  placeKey2: () => element(by.id(testUserAttributes[1].id)),
  serviceproviderInfo: () => element(by.id('service-provider-info')),
  submitButton: () => element(by.id('select-place-key-submit')),
  validationError: () => element(by.css('.text-danger')),
};

const placeKeySelectUrl = `/selecteer-je-huis?clientId=${fake3pServiceProvider.id}`;

describe('PlaceKey select container', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() => {
    browser.get(`/login?redirect_uri=${encodeURIComponent(placeKeySelectUrl)}`);
    browser.wait(loginPage.isLoaded(), 10000);
    loginPage.emailField().sendKeys('placekeys-e2e@example.com');
    loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    loginPage.submit();
    browser.wait(page.isLoaded(), 10000);
  });

  it('should show page', () => {
    expect(page.heading()).toEqual('Welk Tippiq Huis wil je gebruiken?');
    expect(page.placeKeyList().isPresent()).toBe(true);
  });

  it('should show service provider info', () => {
    expect(page.serviceproviderInfo().getText())
      .toEqual(`Wil je inloggen bij ${fake3pServiceProvider.name} met je Tippiq Account?`);
  });

  it('should list the place key options', () => {
    expect(page.placeKey1().isPresent()).toBe(true);
    expect(page.placeKey2().isPresent()).toBe(true);
  });

  it('should display validation errors when no place selected', () => {
    expect(page.validationError().isPresent()).toBe(false);
    page.submitButton().click();
    expect(page.validationError().isPresent()).toBe(true);
  });

  it('should not display validation errors when a place is selected', () => {
    page.placeKey1().click();
    page.submitButton().click();
    expect(page.validationError().isPresent()).toBe(false);
  });
});
