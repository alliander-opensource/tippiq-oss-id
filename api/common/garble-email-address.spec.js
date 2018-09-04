import { expect } from './test-utils';

const { garbleEmailAddress } = require('./garble-email-address');

describe('the garble email address utility', () => {
  const input = 'gargamel@tippiq.nl';
  const garbled = garbleEmailAddress(input);

  describe('the username', () => {
    const username = garbled.substring(0, garbled.indexOf('@'));
    it('should preserve the first character', () => {
      expect(username.startsWith('g')).to.equal(true);
    });

    it('should add five asteriskses after the first character', () => {
      expect(username.substring(1, 6)).to.equal('*****');
    });

    it('should preserve the last character', () => {
      expect(username.endsWith('l')).to.equal(true);
    });
  });

  describe('the domain', () => {
    const domain = garbled.substring(garbled.indexOf('@') + 1, garbled.lastIndexOf('.'));
    it('should preserve the first character', () => {
      expect(domain.startsWith('t')).to.equal(true);
    });

    it('should add three asteriskses after the first character', () => {
      expect(domain.substring(1, 4)).to.equal('***');
    });

    it('should preserve the last character', () => {
      expect(domain.endsWith('q')).to.equal(true);
    });
  });

  describe('the tld', () => {
    const tld = garbled.substring(garbled.lastIndexOf('.') + 1);
    it('should be preserved', () => {
      expect(tld).to.equal('nl');
    });
  });
});
