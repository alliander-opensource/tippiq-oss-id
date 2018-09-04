/**
 * RolePermissionModel.
 * @module modules/auth/models/role-permission-model
 */

import BaseModel from '../../../common/base-model';
import { RoleModel, PermissionModel } from './';

const instanceProps = {
  tableName: 'role_permission',
  role: () => this.belongsTo(RoleModel, 'role'),
  permission: () => this.belongsTo(PermissionModel, 'permission'),
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
