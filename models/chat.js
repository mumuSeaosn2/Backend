const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('chat',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_name:{
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        message :{ 
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    },{
        
        timestamps:true,
        tableName: 'chat',
        paranoid : true, // 삭제일 (복구용)
    })
})