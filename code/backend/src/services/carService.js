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

let checkPlate = (plate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let car = await db.Car.findOne({
                where: { numberPlate: plate }
            });
            if (car) {
                resolve({
                    carId: car.id,
                    errCode: 1,
                    errMessage: 'Biển số đã tồn tại'
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Biển số chưa tồn tại'
                });
            }
        } catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

// let createParkingLogs = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // console.log('check data', data);
//                 let newParkingLogs =  await db.ParkingLog.create({
//                     carId: data.carId,
//                     checkInTime: data.checkInTime,
//                     checkOutTime: data.checkOutTime,
//                     imagePath: data.imagePath,
//                     recognized: data.recognized,
//                     status: data.status
//                 });
//                 resolve({
//                     errCode: 0,
//                     errMessage: 'OK'
//                 });
//             // }
//         } catch (e) {
//             console.log('error: ', e);
//             reject(e);
//         }
//     });
// }    
export default {
    createNewCar: createNewCar,
    // checkPlate: checkPlate,
    // createParkingLogs: createParkingLogs
}