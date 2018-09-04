exports.up = (knex, Promise) =>
  Promise.all([
    knex('permission')
      .insert([
        { name: 'add_attribute', label: 'Add attribute' },
        { name: 'get_attribute', label: 'Get attribute' },
        { name: 'update_attribute', label: 'Update attribute' },
        { name: 'delete_attribute', label: 'Delete attribute' },
      ]),
  ]).then(() =>
    knex('role_permission').insert([
      { role: 'owner', permission: 'add_attribute' },
      { role: 'owner', permission: 'get_attribute' },
      { role: 'owner', permission: 'update_attribute' },
      { role: 'owner', permission: 'delete_attribute' },
    ])
  );

exports.down = knex =>
  Promise.all([
    knex('role_permission').where({ permission: 'add_attribute' }).del(),
    knex('role_permission').where({ permission: 'get_attribute' }).del(),
    knex('role_permission').where({ permission: 'update_attribute' }).del(),
    knex('role_permission').where({ permission: 'delete_attribute' }).del(),
  ]).then(() =>
    Promise.all([
      knex('permission').where({ name: 'add_attribute' }).del(),
      knex('permission').where({ name: 'get_attribute' }).del(),
      knex('permission').where({ name: 'update_attribute' }).del(),
      knex('permission').where({ name: 'delete_attribute' }).del(),
    ])
  );
