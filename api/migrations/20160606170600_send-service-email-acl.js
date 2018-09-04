exports.up = (knex, Promise) => Promise
  .all([
    knex('permission')
      .insert({
        name: 'send_service_email',
        label: 'Send email in name of a client',
      }),
    knex('role').insert({ name: 'service', label: 'Service' }),
  ])
  .then(() => Promise
    .all([
      knex('user')
        .where('id', '48181aa2-560a-11e5-a1d5-c7050c4109ab')
        .map(user => knex('user_role').insert({ user: user.id, role: 'service' })),
      knex('role_permission').insert({ role: 'service', permission: 'send_service_email' }),
    ])
  );

exports.down = (knex, Promise) => Promise
  .all([
    knex('user_role')
      .where({ role: 'service' })
      .del(),
    knex('oauth2_client')
      .where({ client_id: 'b63d545a-0633-11e6-b686-bb1d47039b65' })
      .update({ owner_id: null, owner_type: null }),
    knex('role_permission')
      .where({ role: 'service', permission: 'send_service_email' })
      .del(),
  ])
  .then(() => Promise
    .all([
      knex('role').where({ name: 'service' }).del(),
      knex('permission').where({ name: 'send_service_email' }).del(),
    ])
  );

