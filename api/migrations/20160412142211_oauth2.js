exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('oauth2_client', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('client_id').notNull();
      t.string('client_secret').notNull();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
    knex.schema.createTable('oauth2_authorization_code', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('code').notNull();
      t.string('client_id').notNull();
      t.string('redirect_uri').notNull();
      t.uuid('user_id').notNull();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
    knex.schema.createTable('oauth2_access_token', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('token').notNull();
      t.string('client_id').notNull();
      t.uuid('user_id').notNull();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('oauth2_client'),
    knex.schema.dropTable('oauth2_authorization_code'),
    knex.schema.dropTable('oauth2_access_token'),
  ]);
