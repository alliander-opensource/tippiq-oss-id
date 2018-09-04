export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-feature-links'))),
  heading: () => element(by.css('h1')).getText(),
};

describe('FeatureLinks container', () => {
  beforeEach(() => {
    browser.get('/feature-links');
    browser.wait(page.isLoaded(), 10000);
  });

  it('loads the feature links screen', () => {
    expect(page.heading()).toEqual('Feature links');
  });
});
