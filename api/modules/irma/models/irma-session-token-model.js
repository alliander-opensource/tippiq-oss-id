/**
 * IrmaSessionTokenModel.
 * @module modules/irma/models/irma-session-token-model
 */

import BaseModel from '../../../common/base-model';

const instanceProps = {
  tableName: 'irma_session_token',
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
