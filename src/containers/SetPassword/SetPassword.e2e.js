export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-set-password'))),
  heading: () => element(by.css('h1')).getText(),
  submit: () => element(by.id('passwordSubmitButton')).click(),
  passwordField: () => element(by.id('password')),
  passwordError: () => element(by.id('password'))
    .element(by.xpath('following-sibling::div')).getText(),
  error: () => element(by.css('.alert-danger')),
  result: () => element(by.id('successMessage')),
};

describe('Set password container', () => {
  it('should set a new password', () => {
    browser.get('/wachtwoord-instellen');
    browser.wait(page.isLoaded(), 10000);

    expect(page.heading()).toEqual('Wachtwoord kiezen');

    // Check required field
    page.submit();
    expect(page.passwordError()).toEqual('Verplicht');

    // Check submit
    page.passwordField().sendKeys('test1234ABC');
    page.submit();

    // Check that submitting without a token fails
    browser.wait(protractor.ExpectedConditions.presenceOf(page.error()), 10000);
    expect(page.error().getText()).toEqual('De verificatiecode is verlopen');
  });
});
