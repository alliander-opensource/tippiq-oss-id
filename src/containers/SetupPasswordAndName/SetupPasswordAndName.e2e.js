
import { getSetupPasswordJwtForUserId } from '../../../api/modules/auth/auth';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-setup-password-and-name'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('passwordSubmitButton')).click(),
  userNameField: () => element(by.id('name')),
  passwordField: () => element(by.id('password')),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  error: () => element(by.css('.alert-danger')),
  result: () => element(by.id('successMessage')),
};

describe('Set password and name with token', () => {
  let setupPasswordToken = null;

  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() => getSetupPasswordJwtForUserId('37181aa2-120a-11e5-a1d5-e7050c4109b3')
      .then(token => (setupPasswordToken = token)));

  it('should set a new password and name', () => {
    browser.get(`/voltooi-account?token=${setupPasswordToken}`);
    browser.wait(page.isLoaded(), 10000);

    expect(page.heading()).toEqual('Voltooi je account');

    // Check required field
    page.submit();
    expect(page.passwordError()).toEqual('Verplicht');

    // Check submit
    page.userNameField().sendKeys('naam');
    page.passwordField().sendKeys('test1234ABC');
    page.submit();

    // Check that submitting without a token fails
    browser.wait(protractor.ExpectedConditions.presenceOf(page.result()), 10000);
    expect(page.result().getText()).toEqual('Gelukt!');
  });

  it('should work only once', () => {
    browser.get(`/voltooi-account?token=${setupPasswordToken}`);
    browser.wait(page.isLoaded(), 10000);

    expect(page.heading()).toEqual('Voltooi je account');

    // Check that reusing the same token shows an error message
    expect(page.error().getText()).toEqual('De verificatiecode is verlopen.');
  });
});
