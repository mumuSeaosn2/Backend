const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        id : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        user_name:{
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        message :{ 
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    }, {
        sequelize,
        timestamps:true,
        tableName: 'chat',
        paranoid : true, // 삭제일 (복구용)
        charset: 'utf8',
        collate: 'utf8_general_ci',
      });
    }
  
    static associate(db) {
      db.Chat.belongsTo(db.RoomList);
      db.Chat.belongsTo(db.User);
    }
  };