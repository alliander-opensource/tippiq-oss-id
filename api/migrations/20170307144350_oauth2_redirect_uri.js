exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('oauth2_authorization_code', t => {
      t.dropColumn('redirect_uri');
    }),
    knex.schema.createTable('oauth2_redirect_uri', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('client_id').references('service_provider.id');
      t.string('redirect_uri');
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('oauth2_authorization_code', t => {
      t.string('redirect_uri');
    }),
    knex.schema.dropTable('oauth2_redirect_uri'),
  ]);
