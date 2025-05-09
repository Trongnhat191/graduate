import express from 'express';
import homeController from '../controllers/homeController.js';
import userController from '../controllers/userController.js';

let router = express.Router();

let initWebRoutes = (app) => {
    // ------------------------
    router.get('/', homeController.getHomePage);

    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);

    router.get('/get-crud', homeController.displayGetCRUD);

    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD); 

    router.get('/delete-crud', homeController.deleteCRUD);
    //-------------------------
    
    // API
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    return app.use('/', router);
}

export default initWebRoutes;