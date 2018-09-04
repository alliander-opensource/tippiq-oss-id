import debugLogger from 'debugnyan';
import { knex } from '../api/common/bookshelf';
import { processQueue } from '../api/modules/email/send-email';
import {
  queuedEmailBatchSize,
  queuedEmailMaxRetries,
  queuedEmailBatchId,
} from '../api/config';

const debug = debugLogger('tippiq-id:jobs:process-email-queue');

debug.trace(`Task 'Process email queue' started at ${new Date()}`);

processQueue(queuedEmailBatchId, queuedEmailBatchSize, queuedEmailMaxRetries)
  .finally(() => {
    knex.destroy();
  })
  .then(
    () => {
      debug.trace(`Task 'Process email queue' finished at ${new Date()}`);
    },
    err => {
      debug.warn(`Task 'Process email queue' failed: ${err}`);
      process.exitCode = 1;
    }
  );
