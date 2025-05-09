import axios from '../axios';

const handleLoginApi =async (account, password) => {
    return axios.post('/api/login',
        {
            username: account,
            password: password
        }
    ).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log('error', error);
    }
    )
}

export {
    handleLoginApi,
}