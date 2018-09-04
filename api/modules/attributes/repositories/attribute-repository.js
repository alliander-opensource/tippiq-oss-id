/**
 * AttributeRepository.
 * @module modules/attributes/repositories/attribute-repository
 */
import autobind from 'autobind-decorator';
import { Attribute } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for attributes.
 * @class AttributeRepository
 * @extends BaseRepository
 */
export class AttributeRepository extends BaseRepository {
  /**
   * Construct a AttributeRepository for Attribute.
   * @constructs AttributeRepository
   */
  constructor() {
    super(Attribute);
  }

  /**
   * Find all attributes of a user
   * @function findAllByUser
   * @param {String} userId User id
   * @returns {Array} Attributes
   */
  findAllByUser(userId) {
    return this.Model
      .where({ user_id: userId })
      .fetchAll();
  }

  /**
   * Find all attributes with certain key value pair in payload
   * TODO: Query directly in payload json, instead of getting all user attributes
   * @function findWithPayloadKeyValue
   * @param {String} userId User id
   * @param {String} key Key in payload
   * @param {String} value Value in payload matching key
   * @returns {Array} Attributes
   */
  findWithPayloadKeyValue(userId, key, value) {
    return this.Model
      .where({
        user_id: userId,
      })
      .fetchAll()
      .then(attributes => attributes.filter(attribute =>
        (attribute.get('data')[key] === value ? attribute : false)
      ));
  }
}

export default new AttributeRepository();
