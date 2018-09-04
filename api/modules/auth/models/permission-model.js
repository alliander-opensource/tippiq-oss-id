/**
 * PermissionModel.
 * @module modules/auth/models/permission-model
 */

import BaseModel from '../../../common/base-model';

const instanceProps = {
  tableName: 'permission',
  idAttribute: 'name',
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
