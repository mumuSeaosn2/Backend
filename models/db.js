const mysql = require("mysql");
const dbConfig = require("../config/db.config");

//create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port:dbConfig.PORT,
    connectionLimit: 10
});

//console.log(connection);

//open the MySQL connection

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected");
});

module.exports = connection;