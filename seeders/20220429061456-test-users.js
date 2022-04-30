'use strict';
const bcrypt = require('bcryptjs');

//const { now } = require("sequelize/types/utils");


module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      return  await queryInterface.bulkInsert('user',[{
        id: 1, email: 'example1@mail.com', user_name: '홍길동',password:bcrypt.hashSync('1234', 12),
        createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      },
      {
        id: 2, email: 'example2@mail.com', user_name: '김철수',password:bcrypt.hashSync('4567', 12),
        createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      },
      {
        id: 3, email: 'example3@mail.com', user_name: '김영희',password:bcrypt.hashSync('0123', 12),
        createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      }
      ],{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     return await queryInterface.bulkDelete('user', null, {});
  }
};
