'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ParkingLogs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            carId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Cars',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            checkInTime: {
                type: Sequelize.DATE
            },
            checkOutTime: {
                type: Sequelize.DATE
            },
            imagePath: {
                type: Sequelize.STRING
            },
            recognized: {
                type: Sequelize.BOOLEAN
            },
            status: {
                type: Sequelize.ENUM('in', 'out')
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
        await queryInterface.dropTable('ParkingLogs');
    }
};