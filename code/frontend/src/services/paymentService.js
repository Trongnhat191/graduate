import axios from "../axios";

const createMomoPayment = (data) => {
    // console.log("check data from paymentservice frontend", data);
    return axios.post('/api/momo/payment', data)
}


export {
    createMomoPayment,

}
