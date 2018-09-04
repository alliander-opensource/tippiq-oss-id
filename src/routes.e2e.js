import { page as loginPage } from './containers/Login/Login.e2e';
import { insertTestData, removeTestData } from '../api/common/seed-utils';

export const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-change-username'))),
};

describe('routes', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeEach(() => {
    browser.get('/login?redirect_uri=/mijn-account/naam');
    browser.wait(loginPage.isLoaded(), 10000);
  });

  it('should redirect to the login page for an expired token', () => {
    // Login page
    loginPage.emailField().sendKeys('placekeys-e2e@example.com');
    loginPage.passwordField().sendKeys('8OO!gyxFR9qqB&We');
    loginPage.submit();
    // Navigate to place keys page
    browser.wait(page.isLoaded(), 10000);

    // Set expired token
    browser.executeScript("window.localStorage.setItem('authToken', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJ0aXBwaXEtaWQubG9naW5fc2Vzc2lvbiIsImlhdCI6MTQ5MDI2NjA4MCwiZXhwIjoxNDkwMjY2MDkwLCJhdWQiOiJ0aXBwaXEtaWQubG9jYWwiLCJpc3MiOiJ0aXBwaXEtaWQubG9jYWwiLCJzdWIiOiI0MWY3NzVjYS01MzIwLTQzOTUtOTcyMS03ZjUxNmQzMzM5YjIifQ.MEUCIQCvWyVMc9RoecETD3qeZxnI9GBO9c5gkJeV8d2354rkCgIgXIG0972pEviATg5riLBn5ZvXpxaA8r4ukOuEprA8jZs');");

    // Navigate to change email
    browser.get('/mijn-account/email');

    // Expect redirect
    browser.wait(loginPage.isLoaded(), 10000);
  });
});
