exports.up = knex =>
  knex('permission')
    .insert({
      name: 'get_user',
      label: 'Get garbled information about a user.',
    })
    .then(() =>
      knex('role_permission')
        .insert({
          role: 'service',
          permission: 'get_user',
        })
    );

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'service',
      permission: 'get_user',
    })
    .del()
    .then(() =>
      knex('permission')
        .where({
          name: 'get_user',
        })
        .del()
    );
