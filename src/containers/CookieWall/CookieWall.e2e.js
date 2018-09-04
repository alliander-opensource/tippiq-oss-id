import { page as FeatureLinks } from './../FeatureLinks/FeatureLinks.e2e';

export const page = {
  btnAgree: () => element(by.id('btnAgree')),
  agreeWithCookies: () => element(by.id('btnAgree')).click(),
};

describe('Cookie wall', () => {
  beforeAll(() => {
    browser.get('/feature-links');
    FeatureLinks.isLoaded();
    browser.manage().deleteCookie('viewed_cookie_policy');
  });

  afterAll(() => {
    browser.manage().deleteCookie('viewed_cookie_policy');
  });

  it('should show cookie wall when not agreed yet', () => {
    expect(page.btnAgree().getText()).toEqual('Ik ga akkoord');
  });

  it('should not render cookie wall when agreed', () => {
    page.agreeWithCookies();
    expect(page.btnAgree().isPresent()).toBe(false);
  });

  it('should not render cookie wall when user agreed and page is refreshed ', () => {
    browser.get('/feature-links');
    FeatureLinks.isLoaded();
    expect(page.btnAgree().isPresent()).toBe(false);
  });
});
