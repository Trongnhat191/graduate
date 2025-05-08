'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            account: 'admin',
            password: '123456',
            fullName: 'Nguyễn Văn A',
            roleId: 'R1',
            cccd: '123456789012',
            address: 'Hà Nội',
            phoneNumber: '0123456789',
            gender: 'Nam',
            numberPlate: '30E12345',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        //*****  */
    }
};