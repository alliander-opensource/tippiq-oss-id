exports.seed = knex =>
  knex('service_provider').insert([{
    id: 'd0d68047-9bf3-4a3b-a26d-93ab454654b8',
    name: 'Tippiq ID',
    brand_color: 'FFFFFF',
  }, {
    id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    name: 'Tippiq Buurt',
    brand_color: 'FFFFFF',
  }, {
    id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
    name: 'Reference 3P',
    brand_color: 'FFFFFF',
  }]);
