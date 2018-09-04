import { insertTestData, removeTestData } from '../../../api/common/seed-utils';

export const page = {
  open: email => {
    page.emailField().sendKeys(email);
    page.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    page.submit();
    browser.wait(page.isLoaded('page-feature-links'), 10000);
    // Manually wait 1/10th of a second for the display name action to be completed.
    browser.driver.sleep(100);
  },
  isLoaded: id => protractor.ExpectedConditions.presenceOf(element(by.id(id || 'page-login'))),
  residentTitle: () => element(by.css('.resident-title')).getText(),
  submit: () => element(by.css('.btn-primary')).click(),
  emailField: () => element(by.id('email')),
  passwordField: () => element(by.id('password')),
};

describe('Header container', () => {
  const redirectUri = encodeURIComponent('/feature-links');

  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeEach(() => {
    browser.get(`/login?redirect_uri=${redirectUri}`);
    browser.wait(page.isLoaded(), 10000);
  });

  it('Show the residents display name when the attribute is set', () => {
    page.open('get-display-name-attribute-e2e@example.com');
    expect(page.residentTitle()).toEqual('Chuck Norris');
  });

  it('show the residents email address by default', () => {
    page.open('head-e2e@example.com');
    expect(page.residentTitle()).toEqual('head-e2e@example.com');
  });

  it('show the residents truncated email address when it is very long', () => {
    page.open('get-display-name-email-e2e@example.com');
    expect(page.residentTitle()).toEqual('get-display-name-...');
  });
});
