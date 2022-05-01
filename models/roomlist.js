const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('roomList',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },{
        timestamps:true,
        tableName: 'roomList',
        paranoid : true, // 삭제일 (복구용)
    })
})