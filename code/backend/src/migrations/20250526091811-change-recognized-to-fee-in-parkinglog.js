'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Xóa cột recognized
    await queryInterface.removeColumn('ParkingLogs', 'recognized');
    // Thêm cột fee kiểu INTEGER
    await queryInterface.addColumn('ParkingLogs', 'fee', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột fee
    await queryInterface.removeColumn('ParkingLogs', 'fee');
    // Thêm lại cột recognized kiểu BOOLEAN
    await queryInterface.addColumn('ParkingLogs', 'recognized', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  }
};