import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
    let account = req.body.account;
    let password = req.body.password;

    if (!account || !password) {
        return res.status(400).json({
            // error: 1,
            // message: 'Missing input parameters'
            errCode: 1,
            message: 'Missing input parameters' 
        });
    }


    let userData = await userService.handleUserLogin(account, password);
    console.log('userData', userData.errCode, userData.errMessage, userData.user);

    return res.status(200).json({
        // error: userData.error,
        // message: userData.message,
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing input parameters',
            users: []
        });
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    });
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json({
        errCode: message.errCode,
        message: message.errMessage
    });
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    // if (!data.id || !data.firstName || !data.lastName || !data.email) {
    //     return res.status(200).json({
    //         errCode: 1,
    //         message: 'Missing input parameters'
    //     });
    // }
    let message = await userService.editUser(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json({
        errCode: message.errCode,
        message: message.errMessage
    });
}

export default {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
}