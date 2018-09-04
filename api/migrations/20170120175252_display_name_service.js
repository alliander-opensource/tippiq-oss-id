exports.up = (knex, Promise) => Promise.all([
  knex('role_permission')
    .where({ role: 'authenticated', permission: 'get_user_display_name' })
    .update({ role: 'owner' }),
  knex('role_permission').insert({ role: 'service', permission: 'get_user_display_name' }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex('role_permission')
    .where({ role: 'owner', permission: 'get_user_display_name' })
    .update({ role: 'authenticated' }),
  knex('role_permission').where({ role: 'service', permission: 'get_user_display_name' }).del(),
]);
