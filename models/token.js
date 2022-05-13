const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        refreshToken:{
            type: Sequelize.STRING(60),
            allowNull: false,
            primaryKey: true,
        },
        accessToken:{
            type: Sequelize.STRING(60),
            allowNull: false,
            primaryKey: true,
        },

    },{
        sequelize,
        timestamps: true,
        tableName: 'token',
    })
  }
};