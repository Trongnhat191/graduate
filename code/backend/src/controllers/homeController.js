let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
}

export default {
    getHomePage: getHomePage
}