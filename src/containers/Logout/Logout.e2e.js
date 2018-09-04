import { getLocalstorageValue } from '../../../test/testHelper';
import { page as loginPage } from '../Login/Login.e2e';

export const page = {
  open: () => {
    browser.get('/logout');
    browser.wait(page.isLoaded(), 10000);
  },
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-logout'))),
};

describe('Logout container', () => {
  beforeEach(() => {
    const redirectUri = '/';
    browser.get(`/login?redirect_uri=${redirectUri}`);
    browser.wait(loginPage.isLoaded(), 10000);

    loginPage.emailField().sendKeys('test@test.com');
    loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    loginPage.submit();

    page.open();
  });

  it('the auth token to be removed from localstorage', () => {
    browser.get('/login');
    browser.wait(loginPage.isLoaded(), 10000);
    expect(getLocalstorageValue(browser, 'authToken')).toEqual(null);
  });
});
