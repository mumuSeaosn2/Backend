const credentials = require('../.credential.development');

module.exports = {
    host: credentials.DB.host,
    username: credentials.DB.username,
    password: credentials.DB.password,
    database: credentials.DB.database,
    port: credentials.DB.port,
    dialect:"mysql"
};