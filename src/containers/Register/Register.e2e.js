import secureRandomString from 'secure-random-string';

export const page = {
  open: () => {
    browser.get('/registreren');
    browser.wait(page.isLoaded(), 10000);
  },
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-register'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('registerSubmitButton')).click(),
  emailField: () => element(by.id('email')),
  passwordField: () => element(by.id('password')),
  emailError: () => element(by.id('email')).element(by.xpath('following-sibling::div')).getText(),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  result: () => element(by.id('successMessage')),
};

describe('Register container', () => {
  beforeEach(page.open);

  it('loads the register screen', () => {
    expect(page.heading()).toEqual('Tippiq Account aanmaken');
  });

  it('checks for required fields', () => {
    page.submit();
    expect(page.emailError()).toEqual('Verplicht');
    expect(page.passwordError()).toEqual('Verplicht');
  });

  it('checks for valid email addresses', () => {
    page.emailField().sendKeys('test');
    page.submit();
    expect(page.emailError()).toEqual('Incorrect e-mailadres');
  });

  it('checks for valid password', () => {
    page.passwordField().sendKeys('test123');
    page.submit();
    expect(page.passwordError()).toEqual('Wachtwoord moet uit minimaal 8 karakters bestaan');
  });

  it('registers a user when a valid email password combo is provided', () => {
    page.emailField().sendKeys(`${secureRandomString()}@example.com`);
    page.passwordField().sendKeys('test1234ABC');
    page.submit();

    browser.wait(protractor.ExpectedConditions.presenceOf(page.result()), 10000);
    expect(page.result().getText()).toEqual('Je Tippiq Account is aangemaakt');
  });
});
