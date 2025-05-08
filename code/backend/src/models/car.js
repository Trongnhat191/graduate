const { Model } = require('sequelize');

'use strict';


module.exports = (sequelize, DataTypes) => {
    class Car extends Model {
        static associate(models) {
            // define association here
        }
    }

    Car.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        numberPlate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeIn: {
            type: DataTypes.DATE,
            allowNull: true
        },
        timeOut: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ticketId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Car',
    });

    return Car;
};