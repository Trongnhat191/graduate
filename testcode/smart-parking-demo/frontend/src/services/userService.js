import axios from '../axios';

const handleLoginApi = (account, password) => {
    return axios.post('/api/login',{account,password});
}



// const handleLoginApi = async (account, password) => {
//     try {
//       const response = await handleLoginApi(account, password);
//       console.log('Login success:', response.data);
//       // xử lý khi login thành công
//     } catch (error) {
//       console.error('Login failed:', error); // log lỗi chi tiết
//       if (error.response) {
//         console.error('Response error:', error.response.data); // lỗi từ backend
//       } else {
//         console.error('Network or config error:', error.message);
//       }
//     }
//   };
  

export {
    handleLoginApi,
}