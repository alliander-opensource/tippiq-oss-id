/**
 * RoleCollection.
 * @module modules/auth/collections/role-collection
 */

import bookshelf from '../../../common/bookshelf';
import { Role } from '../models';

const instanceProps = {
  model: Role,
};

const classProps = {};

export default bookshelf.Collection.extend(instanceProps, classProps);
