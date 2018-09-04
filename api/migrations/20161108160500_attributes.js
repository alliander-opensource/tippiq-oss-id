exports.up = knex =>
  knex.schema.table('attribute', (t) => {
    t.renameColumn('payload', 'data');
  });

exports.down = knex =>
  knex.schema.table('attribute', (t) => {
    t.renameColumn('data', 'payload');
  });
