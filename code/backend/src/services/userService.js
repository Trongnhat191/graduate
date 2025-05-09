import db from '../models/index.js';
import bcrypt from 'bcrypt';


let handleUserLogin = (account, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserAccount(account);
            // console.log('isExist', isExist);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['account', 'roleId', 'password'],
                    where : { account: account },
                    raw: true
                })
                if (user){
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.error = 0;
                        userData.message = 'Login successfully';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.error = 3;
                        userData.message = 'Wrong password';
                    }
                } else {
                    userData.error = 2;
                    userData.message = 'Account does not exist';
                }
            } else {
                userData.error = 1;
                userData.message = 'Account does not exist';
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

export default {
    handleUserLogin: handleUserLogin,
}
