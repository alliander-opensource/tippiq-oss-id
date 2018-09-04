import secureRandomString from 'secure-random-string';
import { page as loginPage } from '../Login/Login.e2e';
import { waitUntilURLIsLoaded, getLocalstorageValue } from '../../../test/testHelper';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import protractorConfig from '../../../protractor.conf';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-start'))),
  heading: () => element(by.css('h1')),
  loginOptionButton: () => element(by.id('loginLink')),
  withoutSession: {
    emailAddress: () => element(by.css('.auto-register-form-component #email')),
    registerOptionButton: () => element(by.id('register')),
  },
  withSession: {
    emailAddress: () => element(by.id('email')),
    registerOptionButton: () => element(by.id('registerLink')),
  },
};

describe('Start container', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeEach(() => {
    browser.get('/logout');
  });

  it('shows a heading on the start screen', () => {
    browser.get('/start');
    browser.wait(page.isLoaded(), 10000);
    expect(page.heading().isPresent()).toBe(true);
  });

  it('displays a supplied email address on the screen', () => {
    const randomEmail = `${secureRandomString()}@example.com`;
    browser.get(`/start?email=${randomEmail}`);
    browser.wait(page.isLoaded(), 10000);
    expect(page.withoutSession.emailAddress().getAttribute('value')).toEqual(randomEmail);
  });

  /*
  TODO: fix test, test no longer works:
    PlaceKeySelect will redirect to places first when you have no placekeys yet
  */
  xit('should redirect to PlaceKeySelect with the redirect_uri after the registration procedure', () => {
    const randomEmail = `${secureRandomString()}@example.com`;
    const redirectUri = 'http://testurl/';
    const placeKeyRedirectUri = `${protractorConfig.config.baseUrl}/selecteer-je-huis?redirect_uri=${redirectUri}`;

    browser.get(`/start?email=${randomEmail}&redirect_uri=${encodeURIComponent(redirectUri)}`);
    browser.wait(page.isLoaded(), 10000);
    page.withoutSession.registerOptionButton().click();

    waitUntilURLIsLoaded(browser, placeKeyRedirectUri);
    expect(browser.getCurrentUrl()).toEqual(placeKeyRedirectUri);
  });

  it('should display a login link to enable login with a different account', () => {
    const randomEmail = `${secureRandomString()}@example.com`;
    browser.get(`/start?email=${randomEmail}`);
    page.loginOptionButton().click();
    browser.wait(loginPage.isLoaded(), 10000);
    expect(loginPage.heading().isPresent()).toBe(true);
  });
});

describe('Start container logged in', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  describe('', () => {
    beforeEach(() => {
      const loginRedirectUri = encodeURIComponent('/start?redirect_uri=testurl');
      browser.get(`/login?redirect_uri=${loginRedirectUri}`);
      browser.wait(loginPage.isLoaded(), 10000);
      loginPage.emailField().sendKeys('start@test.com');
      loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
      loginPage.submit();
      browser.wait(page.isLoaded(), 10000);
    });

    it('displays the session email address on the screen', () => {
      expect(page.withSession.emailAddress().getText()).toEqual('start@test.com');
    });

    it('should display a login link to enable login with a different account', () => {
      page.loginOptionButton().click();
      browser.wait(loginPage.isLoaded(), 10000);
      expect(loginPage.heading().isPresent()).toBe(true);
    });

    it('should display a register link', () => {
      page.withSession.registerOptionButton().click();
      browser.wait(page.isLoaded(), 10000);
      expect(page.heading().isPresent()).toBe(true);
    });
  });

  describe('the register link', () => {
    beforeEach(() => {
      const loginRedirectUri = encodeURIComponent('/start?redirect_uri=testurl');
      browser.get(`/login?redirect_uri=${loginRedirectUri}`);
      browser.wait(loginPage.isLoaded(), 10000);
      loginPage.emailField().sendKeys('login@test.com');
      loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
      loginPage.submit();
      browser.wait(page.isLoaded(), 10000);
    });

    it('should logout the user', () => {
      page.withSession.registerOptionButton().click();
      browser.wait(page.isLoaded(), 10000);

      expect(page.heading().isPresent()).toBe(true);
      expect(getLocalstorageValue(browser, 'authToken')).toBe(null);
      expect(page.withoutSession.emailAddress().getAttribute('value')).toEqual('');
    });
  });
});
