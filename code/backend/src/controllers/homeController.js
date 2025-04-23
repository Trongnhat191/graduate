import db from '../models/index.js'

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

export default {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
}