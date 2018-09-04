export const page = {
  loginPage: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-login'))),
};

describe('Home container', () => {
  beforeEach(() => {
    browser.executeScript('window.localStorage.clear();');
  });

  it('without a token', () => {
    browser.get('/');
    browser.wait(page.loginPage(), 2000);
  });
});
