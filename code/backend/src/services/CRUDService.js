//import libraries bcrypt
const bcrypt = require('bcrypt');
const db = require('../models/index.js');

let createNewUser = async (data) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                account: data.account,
                password: hashPasswordFromBcrypt,
                fullName: data.fullName,
                roleId: data.roleId,
                cccd: data.pId,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                numberPlate: data.numberPlate
            })
            resolve('Create new user succeed!');

        }
        catch (error) {
            reject(error);
        }
    })
}

// hash user password bang bcrypt
// Promise dam bao ham luon tra ra ket qua
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData = (data) => {
    // console.log('check data', data);

    return new Promise(async (resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })      
            if (user) {
                user.fullName = data.fullName;
                user.cccd = data.pId;
                user.numberPlate = data.numberPlate;
                user.roleId = data.roleId;
                user.gender = data.gender;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
            else {
                resolve();
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}