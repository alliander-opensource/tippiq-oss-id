import {
  isValidEmail,
  isValidPassword,
  isMinLength,
  isRequired,
} from './validation';

describe('email validation', () => {
  it('should raise an error on invalid email', () => {
    expect(isValidEmail('test')).toBe('Incorrect e-mailadres');
  });

  it('shouldn\'t raise an error on valid email', () => {
    expect(isValidEmail('test@test.com')).toBe('');
  });
});

describe('password validation', () => {
  it('should raise an error on invalid password', () => {
    expect(isValidPassword('test')).toBe('Wachtwoord moet uit minimaal 8 karakters bestaan');
  });

  it('shouldn\'t raise an error on valid password', () => {
    expect(isValidPassword('test123ABC')).toBe('');
  });
});

describe('required validation', () => {
  it('should raise an error on empty value', () => {
    expect(isRequired('')).toBe('Verplicht');
  });

  it('shouldn\'t raise an error on valid input', () => {
    expect(isRequired('test')).toBe('');
  });
});

describe('min length validation', () => {
  it('should raise an error on too short value', () => {
    expect(isMinLength(8)('test')).toBe('Voer minimaal 8 karakters in');
  });

  it('shouldn\'t raise an error on valid input', () => {
    expect(isMinLength(4)('test')).toBe('');
  });
});
