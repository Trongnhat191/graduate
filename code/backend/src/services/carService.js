import db from '../models/index.js';

let createNewCar = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('check data', data);
                let newCar = await db.Car.create({
                    numberPlate: data.numberPlate
                });
                // console.log('newCar: ', newCar)
                resolve({
                    carId: newCar.dataValues.id,
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

let getTicketInfoByNumberPlate = (numberPlate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let carId = await db.Car.findOne({
                where: { numberPlate: numberPlate },
                raw: false
            })
            if (!carId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Car not found',
                    ticketInfo: {}
                });
            }
            let ticketInfo = await db.Ticket.findOne({
                where: { carId: carId.id },
                raw: false
            })
            if (!ticketInfo) {
                resolve({
                    errCode: 1,
                    errMessage: 'Ticket not found',
                    ticketInfo: {}
                });
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                ticketInfo: ticketInfo
            });
        } catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


export default {
    createNewCar: createNewCar,
    getTicketInfoByNumberPlate: getTicketInfoByNumberPlate
}