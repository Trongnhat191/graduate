import db from '../models/index.js'
import CRUDService from '../services/CRUDService.js';

let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data)
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send('post crud from server');
}

let displayGetCRUD = async(req, res) => {
     let data = await CRUDService.getAllUser();
    //  console.log('check data', data);
     return res.render('display-crud.ejs', {
            dataTable: data // truyền data từ controller sang view
                            // Khi đó, display-crud.ejs sẽ có thể sử dụng biến dataTable
     })
}

let getEditCRUD = async(req, res) => {
    let userId = req.query.id; // id từ đường dẫn
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // console.log('check user data', userData);
        return res.render('editCRUD.ejs', {
            user: userData
        })
    } else {
        return res.send('User not found');
    }
}

let putCRUD = async(req,res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('display-crud.ejs', {
        dataTable: allUsers
    })

}

let deleteCRUD = async(req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.send('User not found');
    }
    await CRUDService.deleteUserById(id);

    return res.send('delete user succeed');
}


export default {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}