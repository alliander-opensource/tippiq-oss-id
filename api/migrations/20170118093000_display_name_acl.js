exports.up = (knex) =>
  knex('permission')
    .insert({
      name: 'get_user_display_name',
      label: 'Get user display name',
    })
    .then(() =>
      knex('role_permission').insert({ role: 'authenticated', permission: 'get_user_display_name' })
    );

exports.down = knex =>
  knex('role_permission')
    .where({ role: 'authenticated', permission: 'get_user_display_name' })
    .del()
    .then(() => knex('permission').where({ name: 'get_user_display_name' }).del());
