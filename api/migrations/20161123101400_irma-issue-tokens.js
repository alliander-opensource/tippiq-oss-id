exports.up = knex =>
  knex.schema.createTable('irma_issue_token', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('session_token').unique().notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.uuid('user').references('user.id').notNull();
    t.string('issue_status');
  });

exports.down = knex =>
  knex.schema.dropTable('irma_issue_token');
