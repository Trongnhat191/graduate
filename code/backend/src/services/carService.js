import db from '../models/index.js';

let createNewCar = (data) => {
    //get time 
    // let timeIn = new Date();
    // let timeOut = new Date();
    // timeIn.setHours(timeIn.getHours() + 7);
    // timeOut.setHours(timeOut.getHours() + 7);

    return new Promise(async (resolve, reject) => {
        try {
            console.log('check data', data);
                await db.Car.create({
                    numberPlate: data.numberPlate,
                    timeIn: data.timeIn,
                    timeOut: data.timeOut,
                    ticketId: data.ticketId
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            // }
        } catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

export default {
    createNewCar: createNewCar
}