exports.up = (knex) =>
  knex('permission')
    .insert({
      name: 'quick_registration',
      label: 'Quick registration',
    })
  .then(() =>
    knex('role_permission').insert({ role: 'anonymous', permission: 'quick_registration' })
  );

exports.down = knex =>
  knex('role_permission')
    .where({ role: 'anonymous', permission: 'quick_registration' })
    .del()
    .then(() => knex('permission').where({ name: 'quick_registration' }).del());
