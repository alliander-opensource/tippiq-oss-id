import express from 'express';
import debugLogger from 'debugnyan';

import api from './api';
import { apiPort as port } from './config';

const logger = debugLogger('tippiq-id:server');

express()
  .use('/api', api)
  .listen(port, () => {
    logger.info({ port }, '🚧 API started');
  });
