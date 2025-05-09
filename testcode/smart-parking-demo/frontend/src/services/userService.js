import axios from '../axios';

const handleLoginApi = (account, password) => {
    return axios.post('/api/login',{account,password});
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
  

export {
    handleLoginApi,
    getAllUsers
}