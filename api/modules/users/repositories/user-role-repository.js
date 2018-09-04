/**
 * UserRoleRepository.
 * @module modules/users/repositories/user-role-repository
 */
import autobind from 'autobind-decorator';
import { UserRole } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for UserRole.
 * @class UserRoleRepository
 * @extends BaseRepository
 */
export class UserRoleRepository extends BaseRepository {
  /**
   * Construct a UserRoleRepository for UserRole.
   * @constructs UserRoleRepository
   */
  constructor() {
    super(UserRole);
  }
}

export default new UserRoleRepository();
