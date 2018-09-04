exports.up = knex =>
  knex.schema.createTable('queued_email', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('from').notNull();
    t.string('to').notNull();
    t.json('email');
    t.integer('retries').defaultTo(0).notNull();
    t.text('last_error').nullable();
    t.dateTime('created_at').nullable();
    t.dateTime('updated_at').nullable();
  });

exports.down = knex =>
  knex.schema.dropTable('queued_email');
