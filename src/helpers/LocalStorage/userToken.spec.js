import { isUserTokenValid } from './userToken';

describe('userToken', () => {
  it('should return false for an invalid token', () => {
    expect(isUserTokenValid('invalid token')).toBe(false);
  });
  it('should return false for an expired token', () => {
    expect(isUserTokenValid('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJ0aXBwaXEtaWQubG9naW5fc2Vzc2lvbiIsImlhdCI6MTQ5MDI2NjA4MCwiZXhwIjoxNDkwMjY2MDkwLCJhdWQiOiJ0aXBwaXEtaWQubG9jYWwiLCJpc3MiOiJ0aXBwaXEtaWQubG9jYWwiLCJzdWIiOiI0MWY3NzVjYS01MzIwLTQzOTUtOTcyMS03ZjUxNmQzMzM5YjIifQ.MEUCIQCvWyVMc9RoecETD3qeZxnI9GBO9c5gkJeV8d2354rkCgIgXIG0972pEviATg5riLBn5ZvXpxaA8r4ukOuEprA8jZs')).toBe(false);
  });
});
