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
      // định nghĩa quan hệ 1-n với bảng role
    }
  }
  User.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    roleId: DataTypes.STRING,
    cccd: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    numberPlate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};