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
const db = {};

const sequelize = new Sequelize(dbConfig.database,dbConfig.username,dbConfig.password,dbConfig);
db.User=require('./user')(sequelize,Sequelize);
db.RoomList=require('./roomlist')(sequelize,Sequelize);
db.Chat=require('./chat')(sequelize,Sequelize);

db.User.hasMany(db.Chat);
db.Chat.belongsTo(db.User);
db.RoomList.hasMany(db.Chat);
db.Chat.belongsTo(db.RoomList);
db.User.hasMany(db.RoomList);
db.RoomList.belongsToMany(db.User,{through:'ChatAndUser'})

db.sequelize = sequelize;

module.exports = db;