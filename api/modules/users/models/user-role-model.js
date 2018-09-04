/**
 * User Role Model.
 * @module modules/users/models/user-role-model
 */

import BaseModel from '../../../common/base-model';
import { User } from './';
import { Role } from '../../auth/models';

const instanceProps = {
  tableName: 'user_role',
  user() {
    return this.belongsTo(User, 'user');
  },
  role() {
    return this.belongsTo(Role, 'role');
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
