exports.up = knex =>
  knex('role_permission')
    .insert({ role: 'authenticated', permission: 'get_user' });

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'authenticated',
      permission: 'get_user',
    })
    .del();
