/**
 * UserModel.
 * @module modules/users/models/user-model
 */

import debugLogger from 'debugnyan';
import { chain, includes } from 'lodash';

import BaseModel from '../../../common/base-model';
import { RoleCollection } from '../../auth/collections';
import { OAuth2Client } from '../../oauth2/models';
import { hashPassword } from '../../auth/auth';
import { Attribute } from '../../attributes/models';

const debug = debugLogger('tippiq-id:users:model');

const instanceProps = {
  tableName: 'user',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'user':
        return chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'email',
            'emailIsVerified',
          ])
          .value();
      default:
        debug.debug('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
  setPassword(password) {
    return hashPassword(password)
      .then(passwordHash => this.set('passwordHash', passwordHash).save());
  },
  roles() {
    return this.belongsToMany(RoleCollection, 'user_role', 'user', 'role');
  },
  attributes() {
    return this.hasMany(Attribute, 'user_id');
  },
  oauth2Client() {
    return this.hasOne(OAuth2Client, 'owner_id');
  },
  hasRole(role) {
    const userRoles = this.related('roles').toJSON();
    return includes(userRoles.map(r => r.name), role);
  },
};

const classProps = { dependents: ['attributes'] };

export default BaseModel.extend(instanceProps, classProps);
