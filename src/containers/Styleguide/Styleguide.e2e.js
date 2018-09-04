export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-styleguide'))),
  heading: () => element(by.id('page-title')).getText(),
};

describe('Styleguide container', () => {
  beforeEach(() => {
    browser.get('/styleguide');
    browser.wait(page.isLoaded(), 10000);
  });

  it('loads the styleguide screen', () => {
    expect(page.heading()).toEqual('Page title');
  });
});
