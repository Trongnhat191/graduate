import axios from "../axios";

const createMomoPayment = (data) => {
    // console.log("check data from paymentservice frontend", data);
    return axios.post('/api/momo/payment', data)
}

const getTicketInfoByNumberPlate = (numberPlate) => {
    return axios.get('/api/get-ticket-info-by-number-plate', {
        params: {
            numberPlate: numberPlate
        }
    })
}

const rechargeBalance = (data) => {
    return axios.post('/api/momo/recharge', data)
}

export {
    createMomoPayment,
    getTicketInfoByNumberPlate,
    rechargeBalance

}
