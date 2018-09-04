/**
 * UserRepository.
 * @module modules/users/repositories/user-repository
 */
import autobind from 'autobind-decorator';
import { User } from '../models';
import BaseRepository from '../../../common/base-repository';
import { knex } from '../../../common/bookshelf';

@autobind
/**
 * A Repository for User.
 * @class UserRepository
 * @extends BaseRepository
 */
export class UserRepository extends BaseRepository {
  /**
   * Construct a UserRepository for User.
   * @constructs UserRepository
   */
  constructor() {
    super(User);
  }

  /**
   * Find a User by where clause.
   * @function findOne
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} [options] Bookshelf options to pass on to fetch.
   * @returns {Promise<User>} A Promise that resolves to a User.
   */
  findOneByWhere(where, options = {}) {
    return super
      .findOne(where, {
        ...options,
        withRelated: ['roles'],
      });
  }

  /**
   * Find a User by id.
   * @function findById
   * @param {string} id Id of the user.
   * @returns {Promise<User>} A Promise that resolves to a User.
   */
  findUserById(id) {
    return super
      .findOne({ id }, {
        withRelated: ['roles'],
      });
  }

  /**
   * Find a User by email.
   * @function findByEmail
   * @param {string} email An email address.
   * @param {Object} [options] Bookshelf options to pass on to fetch.
   * @returns {Promise<User>} A Promise that resolves to a User.
   */
  findByEmail(email, options) {
    const lowerCaseEmail = typeof email === 'string' ? email.toLowerCase() : '';
    return super
      .findOne(knex.raw('LOWER(email) LIKE ?', [lowerCaseEmail]), {
        ...options,
        withRelated: ['roles'],
      });
  }
}

export default new UserRepository();
