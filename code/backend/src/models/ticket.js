'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket.belongsTo(models.Car, {
        foreignKey: 'carId',
        as: 'car',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

    }
  }
  Ticket.init({
    carId: DataTypes.INTEGER,
    ticketType: DataTypes.ENUM('day', 'month'),
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};