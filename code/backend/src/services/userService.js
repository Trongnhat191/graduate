import db from '../models/index.js';
import bcrypt from 'bcrypt';
import { updateUserData } from './CRUDService.js';


let handleUserLogin = (account, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserAccount(account);
            // console.log('isExist', isExist);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['account', 'roleId', 'password'],
                    where: { account: account },
                    raw: true
                })
                if (user) {
                    // compare password
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        // userData.error = 0;
                        // userData.message = 'Login successfully';
                        userData.errCode = 0;
                        userData.errMessage = 'Login successfully';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        // userData.error = 3;
                        // userData.message = 'Wrong password';
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    // userData.error = 2;
                    // userData.message = 'Account does not exist';
                    userData.errCode = 2;
                    userData.errMessage = 'Account does not exist';
                }
            } else {
                // userData.error = 1;
                // userData.message = 'Account does not exist';
                userData.errCode = 1;
                userData.errMessage = 'Account does not exist';
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
}

let checkUserAccount = (userAccount) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { account: userAccount }
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
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
            console.log('users', users);
        }
        catch (e) {
            reject(e);
        }
    })
}

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
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserAccount(data.account);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Account already exists'
                });
            }
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
            resolve({
                errCode: 0,
                errMessage: 'OK'
            });
        }
        catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User does not exist'
                });
            }
            await db.User.destroy({
                where: { id: userId }
            });
            resolve({
                errCode: 0,
                errMessage: 'Delete user successfully'
            });
        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
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
                resolve({
                    errCode: 0,
                    errMessage: 'Update user successfully'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'User does not exist'
                });
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
export default {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser,

}
