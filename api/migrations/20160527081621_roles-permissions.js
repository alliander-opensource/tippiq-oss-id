exports.up = knex =>
  knex.schema.createTable('role', (t) => {
    t.string('name').primary();
    t.string('label');
  }).then(() =>
    knex('role')
      .insert([
        { name: 'anonymous', label: 'Anonymous' },
        { name: 'authenticated', label: 'Authenticated' },
        { name: 'owner', label: 'Owner' },
      ])
  ).then(() =>
    knex.schema.createTable('permission', (t) => {
      t.string('name').primary();
      t.string('label');
    })
  ).then(() =>
    knex('permission')
      .insert([
        { name: 'get_service_provider', label: 'Get Service Provider' },
        { name: 'check_user_email', label: 'Check User Email' },
        { name: 'update_user_email', label: 'Update User Email' },
        { name: 'complete_user_email_verification', label: 'Complete User Email Verification' },
        { name: 'start_user_email_verification', label: 'Start User Email Verification' },
        { name: 'get_user_session', label: 'Get User Session' },
        { name: 'login_user', label: 'Login User' },
        { name: 'update_user_password', label: 'Update User Password' },
        { name: 'register_user', label: 'Register User' },
        { name: 'request_reset_user_password', label: 'Request reset User Password' },
        { name: 'reset_user_password', label: 'Reset User Password' },
        { name: 'simple_user_registration', label: 'Simple User Registration' },
        { name: 'generate_test_emails', label: 'Generate Test Emails' },
      ])
  )
  .then(() =>
    knex.schema.createTable('role_permission', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('role').notNull().references('role.name');
      t.string('permission').notNull().references('permission.name');
    })
  )
  .then(() =>
    knex('role_permission')
      .insert([
        { role: 'anonymous', permission: 'get_service_provider' },
        { role: 'anonymous', permission: 'check_user_email' },
        { role: 'authenticated', permission: 'update_user_email' },
        { role: 'anonymous', permission: 'complete_user_email_verification' },
        { role: 'authenticated', permission: 'start_user_email_verification' },
        { role: 'authenticated', permission: 'get_user_session' },
        { role: 'anonymous', permission: 'login_user' },
        { role: 'authenticated', permission: 'update_user_password' },
        { role: 'anonymous', permission: 'register_user' },
        { role: 'anonymous', permission: 'request_reset_user_password' },
        { role: 'anonymous', permission: 'reset_user_password' },
        { role: 'anonymous', permission: 'simple_user_registration' },
      ])
  )
  .then(() =>
    knex.schema.createTable('user_role', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('user').notNull().references('user.id');
      t.string('role').notNull().references('role.name');
    })
  );

exports.down = knex =>
  knex.schema.dropTable('user_role')
    .then(() => knex.schema.dropTable('role_permission'))
    .then(() => knex.schema.dropTable('permission'))
    .then(() => knex.schema.dropTable('role'));
