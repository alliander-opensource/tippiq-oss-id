exports.up = knex =>
  knex.schema.table('queued_email', (t) => {
    t.string('batch_id').nullable();
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
    t.dropColumn('from');
    t.dropColumn('to');
  })
    .then(() =>
      knex.schema.table('queued_email', (t) => {
        t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
        t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
      })
    );

exports.down = knex =>
  knex.schema.table('queued_email', (t) => {
    t.dropColumn('batch_id');
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
    t.string('from').notNull().defaultTo('');
    t.string('to').notNull().defaultTo('');
  })
    .then(() =>
      knex.schema.table('queued_email', (t) => {
        t.dateTime('created_at').nullable();
        t.dateTime('updated_at').nullable();
      }));
