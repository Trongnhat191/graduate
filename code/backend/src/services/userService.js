import db from "../models/index.js";
import bcrypt from "bcrypt";
import { updateUserData } from "./CRUDService.js";

let handleUserLogin = (account, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserAccount(account);
      // console.log('isExist', isExist);
      if (isExist) {
        let user = await db.User.findOne({
          where: { account: account },
          include: [
            {
              model: db.Car,
              as: "cars",
              attributes: ["numberPlate"],
            },
          ],
          raw: true,
        });
        if (user) {
          // compare password
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            // userData.error = 0;
            // userData.message = 'Login successfully';
            userData.errCode = 0;
            userData.errMessage = "Login successfully";
            delete user.password;
            userData.user = user;
          } else {
            // userData.error = 3;
            // userData.message = 'Wrong password';
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          // userData.error = 2;
          // userData.message = 'Account does not exist';
          userData.errCode = 2;
          userData.errMessage = "Account does not exist";
        }
      } else {
        // userData.error = 1;
        // userData.message = 'Account does not exist';
        userData.errCode = 1;
        userData.errMessage = "Account does not exist";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserAccount = (userAccount) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { account: userAccount },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
      // console.log(user);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        attributes: {
          exclude: ["password"],
        },
        raw: true,
      });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsersAndNumberPlate = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Car,
              as: "cars",
              attributes: ["numberPlate"],
            },
          ],
          raw: true,
          nest: true,
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Car,
              as: "carData",
              attributes: ["numberPlate"],
            },
          ],
          raw: true,
          nest: true,
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
    console.log("check data from service", data);
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserAccount(data.account);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: "Account already exists",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        let newUser = await db.User.create({
          account: data.account,
          password: hashPasswordFromBcrypt,
          fullName: data.fullName,
          role: data.role,
          pId: data.pId,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender
        });
        await db.Car.create({
          numberPlate: data.cars.numberPlate,
          userId: newUser.id,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
        console.log('check error', e);
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "User does not exist",
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        errMessage: "Delete user successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('data at nodejs', data);
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.fullName = data.fullName;
        user.pId = data.pId;
        user.role = data.role;
        user.gender = data.gender;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        await user.save();

        let car = await db.Car.findOne({
          where: { userId: data.id },
          raw: false,
        });
        if (car) {
          car.numberPlate = data.cars.numberPlate;
          await car.save();
        }
        resolve({
          errCode: 0,
          errMessage: "Update user successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User does not exist",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let payMoney = (userId, fee) => {  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      // console.log('check user', user);
      if (user) {
        if (user.balance < fee) {
          resolve({
            errCode: 2,
            errMessage: "Not enough money",
          });
          return;
        }
        user.balance = user.balance - fee;
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Pay money successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User does not exist",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

let findUserIdByNumberPlate = (numberPlate) =>{
  return new Promise(async(resolve, reject) => {
    try {
      let user = await db.Car.findOne({
        where: { numberPlate: numberPlate },
        raw: true,
      });
      if (user) {
        resolve(user.userId);
      } else {
        resolve(false);
      }
    } 
    catch (e) {
      reject(e);
    }
  })
}

export default {
  handleUserLogin: handleUserLogin,
  getAllUsersAndNumberPlate: getAllUsersAndNumberPlate,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  editUser: editUser,
  getUserInfoById: getUserInfoById,
  findUserIdByNumberPlate: findUserIdByNumberPlate,
  payMoney: payMoney,
};
