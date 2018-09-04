exports.up = (knex, Promise) => Promise.all([
  knex('role_permission').where({ role: 'service', permission: 'get_user_display_name' }).del(),
]);

exports.down = (knex, Promise) => Promise.all([
  knex('role_permission').insert({ role: 'service', permission: 'get_user_display_name' }),
]);
