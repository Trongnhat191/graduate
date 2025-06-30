'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ParkingLogs', 'status');
    await queryInterface.removeColumn('ParkingLogs', 'imagePath');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('ParkingLogs', 'status', {
      type: Sequelize.ENUM('in', 'out'),
    });

    await queryInterface.addColumn('ParkingLogs', 'imagePath', {
      type: Sequelize.STRING,
    });
  }
};
