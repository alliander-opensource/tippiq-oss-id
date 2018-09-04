/**
 * RoleModel.
 * @module modules/auth/models/role-model
 */

import BaseModel from '../../../common/base-model';

const instanceProps = {
  tableName: 'role',
  idAttribute: 'name',
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
