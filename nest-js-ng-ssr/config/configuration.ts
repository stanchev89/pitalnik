export default () => ({
  port: 4000,
  database: {
    name: 'pi-db-dev',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '123123'
  },
  crypto: {
    salt: 10
  },
  jwt: {
    secretKey: 'dummyKey',
    accessTokenExp: '1h',
    refreshTokenExp: '48h'
  }
});
