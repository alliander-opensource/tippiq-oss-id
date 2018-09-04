exports.up = knex =>
  knex.schema.createTable('attribute', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNull().references('user.id');
    t.json('payload').notNull();
    t.string('label').notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  });

exports.down = knex =>
  knex.schema.dropTable('attribute');
