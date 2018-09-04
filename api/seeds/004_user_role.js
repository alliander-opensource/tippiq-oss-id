exports.seed = knex =>
  knex('user_role').insert([{
    id: 'd6c926af-9ee7-44c3-842d-0ed511db93ba',
    user: '0328eb0f-55bb-4908-a42e-fe783723fa21',
    role: 'service',
  }, {
    id: '17f95c27-e72b-4972-90ac-2286bf864c02',
    user: '4c6552d2-0013-11e7-b984-e32d11de5f99',
    role: 'service',
  }]);
