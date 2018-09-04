var path = require('path');

const knexSettings = {
  client: 'pg',
  connection: process.env.TIPPIQ_ID_DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: path.resolve(__dirname, './api/migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, './api/seeds')
  }
};

module.exports = {
  development: knexSettings,
  production: knexSettings
};
