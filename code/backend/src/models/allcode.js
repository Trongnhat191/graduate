const { Model } = require('sequelize');

'use strict';

module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        static associate(models) {
            // define association here
        }
    }

    Allcode.init({
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Allcode',
    });

    return Allcode;
};