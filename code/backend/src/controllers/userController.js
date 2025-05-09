import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
    let account = req.body.account;
    let password = req.body.password;

    if (!account || !password) {
        return res.status(500).json({
            error: 1,
            message: 'Missing input parameters'
        });
    }


    let userData = await userService.handleUserLogin(account, password);

    return res.status(200).json({
        error: userData.error,
        message: userData.message,
        user: userData.user ? userData.user : {}
    });
}

export default {
    handleLogin: handleLogin,
}