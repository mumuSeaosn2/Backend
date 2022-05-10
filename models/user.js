const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
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
            allowNull: true, 
        },
        provider :{ // 뭐로 로그인 했는지 : 카카오, 로컬,,
            type: Sequelize.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        sns_id:{
            type: Sequelize.STRING(60),
            allowNull: true,
        },

    },{
        sequelize,
        timestamps:true,
        tableName: 'user',
        paranoid : true, // 삭제일 (복구용)
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });

    db.User.belongsToMany(db.RoomList, { through: 'RoomUser' });
    db.User.hasOne(db.Chat);
  }
};