'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParkingLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ParkingLog.belongsTo(models.Car, {
        foreignKey: 'carId',
        as: 'car',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  ParkingLog.init({
    carId: DataTypes.INTEGER,
    checkInTime: DataTypes.DATE,
    checkOutTime: DataTypes.DATE,
    imagePath: DataTypes.STRING,
    recognized: DataTypes.BOOLEAN,
    status: DataTypes.ENUM('in', 'out')
  }, {
    sequelize,
    modelName: 'ParkingLog',
  });
  return ParkingLog;
};