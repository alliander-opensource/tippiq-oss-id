exports.up = (knex, Promise) =>
  Promise.all([
    knex('permission')
      .insert({
        name: 'set_password',
        label: 'Set password for registered users',
      }),
    knex('role').insert({ name: 'registered', label: 'Registered' }),
  ])
  .then(() =>
    knex('role_permission').insert({ role: 'registered', permission: 'set_password' })
  );

exports.down = knex =>
  knex('role_permission')
    .where({ role: 'registered', permission: 'set_password' })
    .del()
    .then(() =>
      Promise.all([
        knex('role').where({ name: 'registered' }).del(),
        knex('permission').where({ name: 'set_password' }).del(),
      ])
    );
