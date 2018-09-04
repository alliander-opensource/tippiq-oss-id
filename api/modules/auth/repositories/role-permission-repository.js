/**
 * RolePermissionRepository.
 * @module modules/auth/repositories/role-permission-repository
 */

import autobind from 'autobind-decorator';
import { RolePermission } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for RolePermission.
 * @class RolePermissionRepository
 * @extends BaseRepository
 */
export class RolePermissionRepository extends BaseRepository {
  /**
   * Construct a RolePermissionRepository for RolePermission.
   * @constructs RolePermissionRepository
   */
  constructor() {
    super(RolePermission);
  }

  /**
   * Find all roles by permission.
   * @function findRolesByPermission
   * @param {string} permission Permission to find roles for
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of roles.
   */
  findRolesByPermission(permission) {
    return this.findAll({ permission });
  }
}

export default new RolePermissionRepository();
