
/**
 * Bookshelf configuration.
 * @module common/bookshelf
 */

import bookshelf from 'bookshelf';
import knex from 'knex';
import bookshelfCascadeDelete from 'bookshelf-cascade-delete';
import debugLogger from 'debugnyan';

import config from '../config';

const debug = debugLogger('tippiq-id:common:bookshelf');
const knexInstance = knex({
  client: 'pg',
  connection: config.databaseUrl,
});
knexInstance.on('query', (query) => {
  debug.debug(query);
});

const bookshelfInstance = bookshelf(knexInstance);

bookshelfInstance.plugin(bookshelfCascadeDelete);

export { knexInstance as knex };
export default bookshelfInstance;
