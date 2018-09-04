exports.up = (knex, Promise) =>
  Promise.all([
    knex('role').insert({ name: 'administrator', label: 'Administrator' }),
    knex('permission').insert({ name: 'delete_user', label: 'Delete user' }),
  ])
  .then(() =>
    knex('role_permission')
      .insert([
        { role: 'administrator', permission: 'delete_user' },
        { role: 'authenticated', permission: 'delete_user' },
      ])
  );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'delete_user' })
    .del()
    .then(() => knex('user_role').where({ role: 'administrator' }).del())
    .then(() => knex('role').where({ name: 'administrator' }).del())
    .then(() => knex('permission').where({ name: 'delete_user' }).del());
