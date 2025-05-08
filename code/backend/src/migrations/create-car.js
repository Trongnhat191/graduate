'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('car', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            numberPlate: {
                type: Sequelize.STRING,
                allowNull: false
            },
            timeIn: {
                type: Sequelize.DATE,
                allowNull: true
            },
            timeOut: {
                type: Sequelize.DATE,
                allowNull: true
            },
            ticketId: {
                type: Sequelize.STRING,
                allowNull: true
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

        // Add index on type and keyMap for faster lookups
        // await queryInterface.addIndex('allcode', ['type', 'keyMap']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('car');
    }
};