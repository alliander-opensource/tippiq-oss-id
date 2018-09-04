exports.seed = knex =>
  knex('user').insert([{
    id: '0328eb0f-55bb-4908-a42e-fe783723fa21',
    email: 'tippiq_hood@tippiq.nl',
    password_hash: '$2a$05$UJbtvgJPrUwoBM7.iiBbluvlzEUbPrJSc0hpCssw6zJZhplJdTata',
    email_is_verified: false,
  }, {
    id: '90c7c881-4b85-4d84-8867-f52e89525d76',
    email: 'test@tippiq.nl',
    password_hash: '$2a$05$Wlal1elvYYR.wkMzFfTIk..QvGenDqOFCNsYyoIkzT/B8xI6UtgTW', // 12345678
    email_is_verified: true,
  }, {
    id: '4c6552d2-0013-11e7-b984-e32d11de5f99',
    email: 'reference-3p@tippiq.nl',
    email_is_verified: false,
  }]);
