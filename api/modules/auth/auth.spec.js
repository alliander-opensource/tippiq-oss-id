/* eslint-disable max-nested-callbacks */
import { expect } from '../../common/test-utils';
import { AuthenticationError } from '../../common/errors';
import { hashPassword, verifyPassword } from './auth';

describe('Auth', () => {
  describe('hashPassword', () => {
    it('should be a function', () => expect(hashPassword).to.be.a('function'));
    it('should return a hash in a well known format', () =>
      expect(hashPassword('password')).to.eventually.match(/^\$2[aby]\$\d+\$.{22}.{31}$/));
  });
  describe('verifyPassword', () => {
    it('should be a function', () => expect(verifyPassword).to.be.a('function'));
    describe('matching my hash previously created by auth.hashPassword', () => {
      let hash;
      before('hash', () =>
        hashPassword('my_secure_pasword_123').then((h) => {
          hash = h;
        })
      );
      it('should return true when the password matches', () =>
        expect(verifyPassword('my_secure_pasword_123', hash)).to.eventually.be.true);
      it('should return false when the password does not match', () =>
        expect(verifyPassword('not_my_password', hash)).to.eventually.be.false);
    });
    it('should throw an error when the hash is not properly formatted', () =>
      expect(verifyPassword('not_my_password', 'not_a_hash'))
        .to.be.rejectedWith(AuthenticationError));
  });
});
