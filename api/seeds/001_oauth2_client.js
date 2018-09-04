exports.seed = knex =>
  knex('oauth2_client').insert([{
    id: 'af266e13-5064-4f11-8f0e-dc35e008143e',
    client_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    client_secret: 'tpq',
    owner_id: '0328eb0f-55bb-4908-a42e-fe783723fa21',
  }, {
    id: 'e1bf6344-025d-11e7-a4fa-6b3c895d34cb',
    client_id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
    client_secret: 'raJoh0eifooquoh0laisahLae',
    owner_id: '4c6552d2-0013-11e7-b984-e32d11de5f99',
  }]);
