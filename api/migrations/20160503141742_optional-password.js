exports.up = knex =>
  knex.schema.raw('alter table ?? alter column ?? drop not null', ['user', 'password_hash']);

exports.down = (knex, Promise) =>
  Promise.all([
    knex('user').whereNull('password_hash').update('password_hash', ''),
    knex.schema.raw('alter table ?? alter column ?? set not null', ['user', 'password_hash']),
  ]);
