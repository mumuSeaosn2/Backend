const Sequelize = require('sequelize');

module.exports = class RoomList extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },{
        sequelize,
        timestamps:true,
        tableName: 'RoomList',
        paranoid : true, // 삭제일 (복구용)
    })
  }

  static associate(db) {
    db.RoomList.belongsToMany(db.User, { through: 'RoomUser' });
    db.RoomList.hasMany(db.Chat);
  }
};