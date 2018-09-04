/**
 * OAuth2 Client Model.
 * @module modules/auth/models/oauth2-client-model
 */

import BaseModel from '../../../common/base-model';
import { User } from '../../users/models';

const instanceProps = {
  tableName: 'oauth2_client',
  owner() {
    return this.belongsTo(User, 'owner_id');
  },
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
