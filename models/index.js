/*
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
*/

const Sequelize = require('sequelize');
const dbConfig = require("../config/db.config");
const User = require('./user');
const RoomList = require('./roomlist');
const Chat = require('./chat')
const db = {};

const sequelize = new Sequelize(dbConfig.database,dbConfig.username,dbConfig.password,dbConfig);

db.sequelize = sequelize;
db.User = User;
db.RoomList = RoomList;
db.Chat = Chat;

User.init(sequelize);
RoomList.init(sequelize);
Chat.init(sequelize);

User.associate(db);
RoomList.associate(db);
Chat.associate(db);

module.exports = db;