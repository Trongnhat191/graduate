'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      Car.hasMany(models.Ticket, {
        foreignKey: 'carId',
        as: 'tickets',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      Car.hasMany(models.ParkingLog, {
        foreignKey: 'carId',
        as: 'parkingLogs',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  Car.init({
    numberPlate: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};