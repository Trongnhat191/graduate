import axios from '../axios';

const handleLoginApi = (account, password) => {
    return axios.post('/api/login',{account,password});
}

const getUserInfoById = (userId) => {
    return axios.get(`/api/get-user-info-by-id?id=${userId}`);
}

const getAllUsersAndNumberPlate = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
  
const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}
export {
    handleLoginApi,
    getAllUsersAndNumberPlate,
    createNewUserService,
    deleteUserService ,
    editUserService,
    getUserInfoById
}