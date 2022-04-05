const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('user',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email:{
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        user_name:{
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        password:{
            type: Sequelize.STRING(60),
            allowNull: false, 
        },
        prvider :{ // 뭐로 로그인 했는지 : 카카오, 로컬,,
            type: Sequelize.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        sns_id:{
            type: Sequelize.STRING(30),
            allowNull: true,
        },

    },{
        
        timestamps:true,
        tableName: 'user',
        paranoid : true, // 삭제일 (복구용)
    })
})