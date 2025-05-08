'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
    //   account: DataTypes.STRING,
    // password: DataTypes.STRING,
    // fullName: DataTypes.STRING,
    // roleId: DataTypes.STRING,
    // cccd: DataTypes.STRING,
    // address: DataTypes.STRING,
    // phoneNumber: DataTypes.STRING,
    // gender: DataTypes.STRING,
    // numberPlate: DataTypes.STRING
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.STRING
      },
      cccd: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      numberPlate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};