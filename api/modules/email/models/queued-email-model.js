/**
 * QueuedEmailModel.
 * @module modules/email/models/queued-email-model
 */

import BaseModel from '../../../common/base-model';

const instanceProps = {
  tableName: 'queued_email',
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);
