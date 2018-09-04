exports.up = knex =>
  knex.schema.createTable('irma_session_token', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('session_token').unique().notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.uuid('user').references('user.id');
  });

exports.down = knex =>
  knex.schema.dropTable('irma_session_token');
