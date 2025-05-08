'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('allcode', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            key: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false
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
        await queryInterface.dropTable('allcode');
    }
};