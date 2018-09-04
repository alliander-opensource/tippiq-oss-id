exports.up = knex =>
  knex.schema.table('user', (t) => {
    t.boolean('email_is_verified').notNullable().defaultTo(knex.raw('false'));
  });

exports.down = knex =>
  knex.schema.table('user', (t) => {
    t.dropColumn('email_is_verified');
  });
