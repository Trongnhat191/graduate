'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Car, {
        foreignKey: 'userId',
        as: 'cars',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user','staff'),
    pId: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.ENUM('male', 'female')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};