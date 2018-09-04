exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('service_provider', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('name').notNull();
      t.string('brand_color').nullable();
      t.binary('logo').nullable();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
    knex.schema.table('oauth2_client', (t) => {
      t.uuid('owner_id').nullable();
      t.string('owner_type', 64).nullable();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('service_provider'),
    knex.schema.table('oauth2_client', (t) => {
      t.dropColumns(['owner_id', 'owner_type']);
    }),
  ]);
