import { page as loginPage } from '../Login/Login.e2e';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import testUserAttributes from '../../../api/testdata/attributes';

const placeKeyAttributes = testUserAttributes
  .filter(att => att.data && att.data.type === 'place_key')
  .map(att => att.label);

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-place-keys'))),
  heading: () => element(by.css('h1')).getText(),
  placeKeyList: () => element(by.id('list-place-keys')),
  placeKeys: () => element.all(by.className('btn-link')).map(e => e.getText()),
};

describe('PlaceKeys container', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeEach(() => {
    browser.get('/login?redirect_uri=/mijn-huissleutels');
    browser.wait(loginPage.isLoaded(), 10000);
  });

  it('should display 2 place keys', () => {
    // Login page
    loginPage.emailField().sendKeys('placekeys-e2e@example.com');
    loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    loginPage.submit();

    // My place keys
    browser.wait(page.isLoaded(), 10000);
    expect(page.heading()).toEqual('Gekoppelde huizen');
    expect(page.placeKeyList().isPresent()).toBe(true);
    expect(page.placeKeys()).toEqual(placeKeyAttributes);
  });
});
