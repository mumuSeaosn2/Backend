const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('roomlist',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },{
        timestamps:true,
        tableName: 'roomlist',
        paranoid : true, // 삭제일 (복구용)
    })
})