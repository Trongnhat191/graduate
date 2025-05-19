import { exec } from 'child_process';
import axios from 'axios';
import db from '../models/index.js';
import { create } from 'domain';

let currentStatus = {
    slot1: 'empty',
    slot2: 'empty',
};

let entryHandle = false;
let exitHandle = false;

const wssClients = new Set();

export const registerClient = (ws) => {
    ws.send(JSON.stringify(currentStatus));
    wssClients.add(ws);

    ws.on('close', () => {
        wssClients.delete(ws);
    });
};

let checkPlateExisted = async (plate) => {
    return new Promise(async (resolve, reject) => {
        try{
            let car = await db.Car.findOne({
                where: {numberPlate: plate}
            });
            if (car) {
                resolve({
                    carId: car.id,
                    errCode: 1,
                    errMessage: 'Biển số đã tồn tại'
                });
            }
            else {
                resolve({
                    errCode: 0,
                    errMessage: 'Biển số chưa tồn tại'
                });
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let createParkingLogs = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let parkingLog = await db.ParkingLog.create({
                carId: carId,
                checkInTime: new Date(),
                // checkOutTime: null,
                // imagePath: null,
                // recognized: null,
                // status: 'active'
            });
            resolve(parkingLog);
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let checkTicketExisted = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                }
            });
            if (ticket) {
                resolve({
                    endDate: ticket.endDate,
                    errCode: 1,
                    errMessage: 'Biển số đã tồn tại'
                });
            }
            else {
                resolve({
                    errCode: 0,
                    errMessage: 'Biển số chưa tồn tại'
                });
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let createNewTicket = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let ticket = await db.Ticket.create({
                carId: carId,
                ticketType: 'day',
                startDate: new Date(),
                endDate: null, // 1 hour
                price: 10
            });
            resolve(ticket);
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    }
    );
}

let findCarIdByPlate = async (plate) => {
    return new Promise(async (resolve, reject) => {
        try{
            let car = await db.Car.findOne({
                where: {numberPlate: plate}
            });
            if (car) {
                resolve(car.id);
            }
            else {
                resolve(null);
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let updateCheckOutTime = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const parkingLog = await db.ParkingLog.findOne({
                // carId = carId and checkOutTime = null
                where: {
                    carId: carId,
                    checkOutTime: null
                },
                raw: false
            });
            if (parkingLog) {
                parkingLog.checkOutTime = new Date();
                await parkingLog.save();
                resolve(parkingLog);
            }
            else {
                resolve(null);
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let updateEndDate = async (carId) => { // và trả về số ngày gửi xe
    return new Promise(async (resolve, reject) => {
        try{
            const ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                endDate: null
                },
                raw: false
            });
            if (ticket) {
                ticket.endDate = new Date();
                await ticket.save();
                // Tính số ngày gửi xe (chỉ sử dụng ngày)
                const startDate = new Date(ticket.startDate).getDate();
                const endDate = new Date(ticket.endDate).getDate();
                const timeDiff = startDate - endDate +1;
                // console.log("timeDiff: ", timeDiff);
                resolve(timeDiff);

            }
            else {
                resolve(null);
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let checkIfTicketTypeIsMonth = async(carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                }
            });
            console.log("ticket: ", ticket.ticketType);
            if (ticket) {
                if (ticket.ticketType === 'month') {
                    resolve(true);
                    // console.log("ticket: ", ticket);
                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false);
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let deleteTicketByCarId = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                },
                raw: false

            });
            if (ticket) {
                await ticket.destroy();
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

export const processSensorData = async ({ entry, exit, slot1, slot2 }) => {
    const response = {
        openEntryServo: false,
        openExitServo: false,
    };

    // console.log("Xử lý entry");
    if (entry < 10 && !entryHandle) {
        entryHandle = true;
        response.openEntryServo = true;
        exec('conda run -n graduate python src/python/detect_plate.py 0 src/photos/entry', async (err, stdout, stderr) => {
            if (err) {
                console.error(`[Python Entry] ❌ ${stderr}`);
            } else {
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const plate = lastLine.trim();

                try {
                    const checkResponse = await checkPlateExisted(plate);
                    // console.log('CheckRes: ', checkResponse)
                    // await createParkingLogs(checkResponse.carId);
                    // console.log("createParkingLogs Done: ", checkResponse.carId)

                    if (checkResponse.errCode === 1) { // Biển số đã tồn tại
                        await createParkingLogs(checkResponse.carId);
                        // Kiểm tra xem carId có trong bảng Tickets không
                        console.log(`[Entry Car] ✅ Biển số đã tồn tại: ${plate}`);
                        const ticketExisted = await checkTicketExisted(checkResponse.carId);
                        if (ticketExisted.errCode === 1) { // Vé đã tồn tại
                            const currentDate = new Date();
                            const endDate = new Date(ticketExisted.endDate);
                            if (currentDate > endDate) {
                                console.log(`[Create Car] ❌ Vé đã hết hạn`);
                                await deleteTicketByCarId(checkResponse.carId);
                                console.log(`[Create Car] ✅ Đã xóa vé tháng cũ cho biển số ${plate}`);
// Xóa vé tháng cũ đã hết hạn
                                const ticket = await createNewTicket(checkResponse.carId);
                                console.log(`[Create Car] ✅ Đã tạo vé ngày mới cho biển số ${plate}`);
                            } else {
                                console.log(`[Create Car] ✅ Vé còn hiệu lực, cho xe vào`);
                            }
                        } else { // Vé chưa tồn tại
                            console.log(`[Create Car] ❌ Vé chưa tồn tại`);
                            const ticket = await createNewTicket(checkResponse.carId);
                            console.log(`[Create Car] ✅ Đã tạo vé ngày cho biển số ${plate}`);
                        }
                    }
                    else { // Biển số chưa tồn tại
                        console.log(`[Create Car] ❌ Biển số chưa tồn tại: ${plate}`);
                        const checkResponse = await axios.post('http://localhost:6969/api/create-new-car', {
                            numberPlate: plate
                        });
                        // console.log('CheckRes: ', checkResponse)
                        const carId = checkResponse.data.carId;
                        // console.log(`[Create Car] ✅ Đã tạo xe mới với biển số ${carId}`);
                        await createParkingLogs(carId);
                        await createNewTicket(carId);
                        // console.log(`[Create Car] ✅ Đã lưu biển số ${plate}`);
                    }

                } catch (apiErr) {
                    console.error(`[Create Car] ❌ Lỗi khi gửi API: ${apiErr}`);
                }
            }
        });
    }
    else if (entry > 10 && entryHandle) {
        entryHandle = false;
    }
    // Xử lý exit
    // console.log("Xử lý exit");
    if (exit < 10 && !exitHandle) {
        exitHandle = true;
        response.openExitServo = true;
        exec('conda run -n graduate python src/python/detect_plate.py 0 src/photos/exit', async (err, stdout, stderr) => {
            if (err) console.error(`[Python Exit] ❌ ${stderr}`);
            else {
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const plate = lastLine.trim();

                const carId = await findCarIdByPlate(plate);
                console.log('carId: ', carId);
                // Ghi Thời gian xe ra vào logs
                try{
                    if (carId) {
                        await updateCheckOutTime(carId);
                        console.log(`[Create Car] ✅ Đã cập nhật thời gian ra cho biển số ${plate}`);
                    } else {
                        console.log(`[Create Car] ❌ Không tìm thấy biển số ${plate}`);
                    }
                }
                catch (e) {
                    console.log('error: ', e);
                }

                // Kiểm tra loại vé 
                if (await checkIfTicketTypeIsMonth(carId)){
                    console.log("✅ Vé tháng còn hạn, không thu phí`");
                }
                else {
                    console.log("❌ Vé ngày, thu phí");
                    // await updateEndDate(carId);
                    // Tính số ngày gửi xe
                    let timeDiff = await updateEndDate(carId);
                    console.log("timeDiff: ", timeDiff);
                    await deleteTicketByCarId(carId);
                    console.log(`[Create Car] ✅ Đã xóa vé ngày cho biển số ${plate}`);
                }
            }
        });
    }
    else if (exit > 10 && exitHandle) {
        exitHandle = false;
    }

    // Xử lý cập nhật trạng thái chỗ đỗ
    const newStatus = {
        slot1: slot1 < 50 ? 'occupied' : 'empty',
        slot2: slot2 < 50 ? 'occupied' : 'empty',
    };

    const isChanged =
        newStatus.slot1 !== currentStatus.slot1 ||
        newStatus.slot2 !== currentStatus.slot2;

    if (isChanged) {
        currentStatus = newStatus;
        broadcastStatus(currentStatus);
    }

    return response; // trả về cho controller
};


const broadcastStatus = (status) => {
    for (const client of wssClients) {
        if (client.readyState === 1) {
            client.send(JSON.stringify(status));
        }
    }
};
