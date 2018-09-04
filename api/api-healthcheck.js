/**
 * @author Tippiq
 */
import BPromise from 'bluebird';
import healthcheck from 'healthcheck-middleware';
import { VError } from 'verror';
import debugLogger from 'debugnyan';

import { knex } from './common/bookshelf';
import transporter from './modules/email/transporters';
import { mailTransporter } from './config';

const logger = debugLogger('tippiq-id:healthcheck:api');

export default () => healthcheck({
  addChecks: (fail, pass) => {
    BPromise
      .all([
        knex.migrate.currentVersion()
          .then(version => ({ version, reachable: true }))
          .catch(cause => new VError({ cause }, 'Knex Error')),
        BPromise
          .try(() => transporter().verify())
          .then(reachable => ({ reachable }))
          .catch(error => ({ reachable: false, error: `Mail transporter: ${error}` }))
          .then(status => ({ ...status, transporter: mailTransporter, critical: false })),
      ])
      .tapCatch(logger.error.bind(logger))
      .spread((database, mail) => pass({
        database,
        mail,
      }))
      .catch(fail);
  },
});
