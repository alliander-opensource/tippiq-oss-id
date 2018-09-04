exports.seed = knex =>
  knex('oauth2_redirect_uri').insert([{
    client_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    redirect_uri: 'http://localhost:3007/',
  }, {
    client_id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
    redirect_uri: 'http://localhost:3015/',
  }]);
