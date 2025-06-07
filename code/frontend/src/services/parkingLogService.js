import axios from '../axios';

const getParkingLogsByUserId = (userId) => {
    // console.log("Fetching parking logs for user ID:", userId);
    return axios.get(`/api/parking-logs?userId=${userId}`);
}

export {
    getParkingLogsByUserId,
};