exports.up = knex =>
  knex.schema.table('user', (t) => {
    t.unique(['email']);
  });

exports.down = knex =>
  knex.schema.table('user', (t) => {
    t.dropUnique(['email']);
  });
