const Sequelize = require('sequelize');

module.exports = class Token extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        refreshToken:{
            type: Sequelize.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        accessToken:{
            type: Sequelize.STRING(255),
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