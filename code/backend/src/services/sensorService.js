import { exec } from "child_process";
import axios from "axios";
import db from "../models/index.js";
import { create } from "domain";
import userService from "./userService.js";

let currentStatus = {
    slot1: "empty",
    slot2: "empty",
    slot3: "empty",
    slot4: "empty",
    slot5: "empty",
    currentNumberPlateIn: "",
    imageIn: "",
    ticketTypeIn: "",

    currentNumberPlateOut: "",
    imageOut: "",
    ticketTypeOut: "",
    fee: 0,

    cash: false,
};

let entryHandle = false;
let exitHandle = false;

const wssClients = new Set();

export const registerClient = (ws) => {
    ws.send(JSON.stringify(currentStatus));
    wssClients.add(ws);

    ws.on("close", () => {
        wssClients.delete(ws);
    });
};

let checkPlateExisted = async (plate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let car = await db.Car.findOne({
                where: {
                    numberPlate: plate
                },
            });
            if (car) {
                if (car.userId === null) {
                    // Biển số đã tồn tại nhưng chưa có người dùng
                    return resolve({
                        carId: car.id,
                        errCode: 2,
                        errMessage: "Biển số đã tồn tại nhưng chưa có người dùng",
                    });
                }
                // Biển số đã tồn tại và có người dùng
                else {
                    return resolve({
                        carId: car.id,
                        errCode: 1,
                        errMessage: "Biển số đã tồn tại và có người dùng",
                    });
                }

            } else {
                resolve({
                    errCode: 0,
                    errMessage: "Biển số chưa tồn tại",
                });
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let createParkingLogs = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let parkingLog = await db.ParkingLog.create({
                carId: carId,
                checkInTime: new Date(),
            });
            resolve(parkingLog);
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let checkMonthTicketExisted = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                    ticketType: "month",
                },
            });
            if (ticket) {
                resolve({
                    endDate: ticket.endDate,
                    errCode: 1,
                    errMessage: "Vé tháng đã tồn tại",
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: "Vé tháng chưa tồn tại",
                });
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let createNewTicket = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ticket = await db.Ticket.create({
                carId: carId,
                ticketType: "day",
                startDate: new Date(),
                endDate: null, // 1 hour
                price: 10000,
            });
            resolve(ticket);
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let findCarIdByPlate = async (plate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let car = await db.Car.findOne({
                where: { numberPlate: plate },
            });
            if (car) {
                resolve(car.id);
            } else {
                resolve(null);
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let updateCheckOutTimeAndFee = async (carId, fee) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parkingLog = await db.ParkingLog.findOne({
                // carId = carId and checkOutTime = null
                where: {
                    carId: carId,
                    checkOutTime: null,
                },
                raw: false,
            });
            if (parkingLog) {
                parkingLog.checkOutTime = new Date();
                parkingLog.fee = fee;
                await parkingLog.save();
                resolve(parkingLog);
            } else {
                resolve(null);
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let updateEndDate = async (carId) => {
    // và trả về số ngày gửi xe
    return new Promise(async (resolve, reject) => {
        try {
            const ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                    endDate: null,
                },
                raw: false,
            });
            if (ticket) {
                ticket.endDate = new Date();
                await ticket.save();
                // Tính số ngày gửi xe (chỉ sử dụng ngày)
                const startDate = new Date(ticket.startDate).getDate();
                const endDate = new Date(ticket.endDate).getDate();
                const timeDiff = endDate - startDate + 1;
                // console.log("timeDiff: ", timeDiff);
                resolve(timeDiff);
            } else {
                resolve(null);
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

let checkIfTicketTypeIsMonth = async (carId) => {
    try {
        let ticket = await db.Ticket.findOne({
            where: {
                carId: carId,
                ticketType: "month",
            },
            order: [["updatedAt", "DESC"]], // lấy vé gần nhất
        });

        if (ticket) {
            const now = new Date();
            const endDate = new Date(ticket.endDate);

            if (endDate >= now) {
                console.log("Vé tháng còn hạn");
                return true; // vé còn hạn
            } else {
                console.log("Vé tháng đã hết hạn");
                return false; // vé hết hạn
            }
        } else {
            return false; // không có vé tháng nào
        }
    } catch (e) {
        console.log("error from checkIfTicketTypeIsMonth: ", e);
        throw e;
    }
};

let deleteTicketByCarId = async (carId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ticket = await db.Ticket.findOne({
                where: {
                    carId: carId,
                },
                raw: false,
            });
            if (ticket) {
                await ticket.destroy();
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            console.log("error: ", e);
            reject(e);
        }
    });
};

export const processSensorData = async ({ entry, exit, slot1, slot2, slot3, slot4, slot5 }, ws) => {
    const response = {
        openEntryServo: false,
        openExitServo: false,
    };


    if (entry < 10 && !entryHandle) {
        entryHandle = true;
        const isFull = 
            currentStatus.slot1 === "occupied" &&
            currentStatus.slot2 === "occupied" &&
            currentStatus.slot3 === "occupied" &&
            currentStatus.slot4 === "occupied" &&
            currentStatus.slot5 === "occupied";
        
        if (isFull) {
            console.log("[Entry Car] 🅿️ Bãi xe đã đầy. Từ chối xe vào.");
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify({ parkingFull: true }));
            }
            return; // Dừng xử lý, không mở cổng
        }
        exec(
            "conda run -n graduate python src/python/detect_plate.py 2 src/public/photos/entry",
            async (err, stdout, stderr) => {
                if (err) {
                    console.log("---------------------");
                    console.error(`[Python Entry] ❌ ${stderr}`);
                    console.log("---------------------");
                    console.log(stdout.trim().split("\n"));
                    currentStatus.currentNumberPlateIn = "error";
                    currentStatus.imageIn = stdout.trim().split("\n")[0];
                    currentStatus.ticketTypeIn = "";
                    broadcastStatus(currentStatus);
                    if (ws && ws.readyState === 1) {
                        ws.send(JSON.stringify({ openEntryServo: false, plate: "error" }));
                    }
                } else {
                    const lines = stdout.trim().split("\n");
                    const lastLine = lines[lines.length - 1];
                    const plate = lastLine.trim();
                    const imageName = lines[0].trim();
                    console.log("[Entry Car] 🅿️ Biển số nhận được: ", plate);
                    // Gửi lệnh mở servo 
                    if (plate !== "error" && ws && ws.readyState === 1) {
                        ws.send(JSON.stringify({ openEntryServo: true, "plate": plate }));
                    }

                    currentStatus.currentNumberPlateIn = plate;
                    currentStatus.imageIn = imageName;
                    // console.log("currentStatus: ", currentStatus);
                    broadcastStatus(currentStatus);
                    try {
                        const checkResponse = await checkPlateExisted(plate);

                        if (checkResponse.errCode === 1) {
                            // Biển số đã tồn tại
                            await createParkingLogs(checkResponse.carId);
                            // Kiểm tra xem carId có trong bảng Tickets không
                            // console.log(`[Entry Car] ✅ Biển số đã tồn tại: ${plate}`);
                            const monthTicketExisted = await checkMonthTicketExisted(
                                checkResponse.carId
                            );
                            if (monthTicketExisted.errCode === 1) {
                                // Vé đã tồn tại
                                const currentDate = new Date();
                                const endDate = new Date(monthTicketExisted.endDate);
                                if (currentDate > endDate) {
                                    console.log(`[Create Car] ❌ Vé tháng đã hết hạn`);
                                    // await deleteTicketByCarId(checkResponse.carId);
                                    // console.log(
                                    //     `[Create Car] ✅ Đã xóa vé tháng cũ cho biển số ${plate}`
                                    // );
                                    const ticket = await createNewTicket(checkResponse.carId);
                                    console.log(
                                        `[Create Car] ✅ vì vé tháng hết hạn, Đã tạo vé ngày mới cho biển số ${plate}`
                                    );
                                    currentStatus.ticketTypeIn = "day";
                                } else {
                                    console.log(`[Create Car] ✅ Vé tháng còn hiệu lực, cho xe vào`);
                                    currentStatus.ticketTypeIn = "month";
                                    broadcastStatus(currentStatus);
                                }
                            } else {
                                // Vé chưa tồn tại
                                console.log(`[Create Car] ❌ Vé chưa tồn tại`);
                                const ticket = await createNewTicket(checkResponse.carId);
                                currentStatus.ticketTypeIn = "day";
                                console.log(
                                    `[Create Car] ✅ Đã tạo vé ngày cho biển số ${plate}`
                                );
                            }
                        } else if (checkResponse.errCode === 0) {
                            // Biển số chưa tồn tại và chưa có người dùng
                            console.log(`[Create Car] ❌ Biển số chưa tồn tại và ko có user: ${plate}`);
                            const checkResponse1 = await axios.post(
                                "http://localhost:6969/api/create-new-car",
                                {
                                    numberPlate: plate
                                }
                            );
                            const carId = checkResponse1.data.carId;
                            await createParkingLogs(carId);
                            await createNewTicket(carId);
                            currentStatus.ticketTypeIn = "day";
                        }
                        else { // Biển số tồn tại nhưng chưa có người dùng
                            console.log(`[Create Car] ❌ Biển số đã tồn tại nhưng chưa có người dùng: ${plate}`);
                            const carId = await findCarIdByPlate(plate);
                            await createParkingLogs(carId);
                            await createNewTicket(carId);
                            currentStatus.ticketTypeIn = "day";
                        }
                        broadcastStatus(currentStatus);
                    } catch (apiErr) {
                        console.error(`[Create Car] ❌ Lỗi khi gửi API: ${apiErr}`);
                    }
                }
            }
        );
    } else if (entry > 10 && entryHandle) {
        entryHandle = false;
    }

    // Xử lý exit
    if (exit < 10 && !exitHandle) { 
        exitHandle = true;
        response.openExitServo = true;
        exec(
            "conda run -n graduate python src/python/detect_plate.py 4 src/public/photos/exit",
            async (err, stdout, stderr) => {
                if (err) {
                    console.log("---------------------");
                    console.error(`[Python Exit] ❌ ${stderr}`);
                    console.log("---------------------");
                    console.log(stdout.trim().split("\n"));
                    currentStatus.currentNumberPlateOut = "error";
                    currentStatus.imageOut = stdout.trim().split("\n")[0];
                    currentStatus.ticketTypeOut = "";
                    broadcastStatus(currentStatus);
                } else {
                    const lines = stdout.trim().split("\n");
                    const lastLine = lines[lines.length - 1];
                    const plate = lastLine.trim();
                    const imageName = lines[0].trim();

                    currentStatus.currentNumberPlateOut = plate;
                    currentStatus.imageOut = imageName;
                    broadcastStatus(currentStatus);
                    try {
                        const carId = await findCarIdByPlate(plate);
                        if (!carId) {
                            console.log(`[Exit Car] ❌ Biển số không tồn tại: ${plate}`);
                            currentStatus.ticketTypeOut = "";
                            broadcastStatus(currentStatus);
                            return;
                        }

                        const isMonthTicket = await checkIfTicketTypeIsMonth(carId);
                        console.log("loại vé: ", isMonthTicket);
                        if (isMonthTicket) {  // Nếu là vé tháng
                            console.log(
                                `[Exit Car] ✅ Vé tháng, không tính phí cho biển số ${plate}`
                            );
                            await updateCheckOutTimeAndFee(carId, 0);
                            currentStatus.ticketTypeOut = "month";
                            // Gửi lệnh mở servo
                            if (plate !== "error" && ws && ws.readyState === 1) {
                                ws.send(JSON.stringify({ openExitServo: true }));
                            }
                        } else {  // Nếu là vé ngày
                            const timeDiff = await updateEndDate(carId);

                            const fee = 10000 * timeDiff;
                            console.log("timeDiff: ", timeDiff);
                            console.log("fee", fee);
                            currentStatus.fee = fee;
                            const userId = await userService.findUserIdByNumberPlate(plate);
                            if (!userId) {
                                console.log(`[Exit Car] ❌ Biển số ${plate} không có người dùng nên thanh toán tiền mặt`);
                                currentStatus.cash = true;
                                currentStatus.ticketTypeOut = "day";
                                broadcastStatus(currentStatus);
                                return;
                            }
                            else {
                                const paymentResponse = await userService.payMoney(
                                    userId,
                                    fee
                                );
                                if (paymentResponse.errCode === 0) { // Thanh toán thành công
                                    console.log('log from sensorService.js',
                                        paymentResponse.errMessage
                                    );
                                    await updateCheckOutTimeAndFee(carId, fee);

                                    // Gửi lệnh mở servo
                                    if (plate !== "error" && ws && ws.readyState === 1) {
                                        ws.send(JSON.stringify({ openExitServo: true }));
                                    }
                                }
                                else if (paymentResponse.errCode === 2) { // Không đủ tiền
                                    console.log('log from sensorService.js',
                                        paymentResponse.errMessage
                                    );
                                    // Thanh toán tiền mặt
                                    currentStatus.cash = true;
                                    broadcastStatus(currentStatus);
                                }
                                else {
                                    console.log( // Lỗi khác
                                        'log from sensorService.js',
                                        paymentResponse.errMessage
                                    );
                                }
                                currentStatus.ticketTypeOut = "day";
                            }


                        }
                        broadcastStatus(currentStatus);
                    } catch (err) {
                        console.error(`[Exit Car] ❌ Lỗi khi gửi API: ${err}`);
                        currentStatus.ticketTypeOut = "";
                        broadcastStatus(currentStatus);
                    }
                }
            }
        );
    } else if (exit > 10 && exitHandle) {
        exitHandle = false;
    }

    // Xử lý cập nhật trạng thái chỗ đỗ
    const newStatus = {
        slot1: slot1 < 10 ? "occupied" : "empty",
        slot2: slot2 < 10 ? "occupied" : "empty",
        slot3: slot3 < 10 ? "occupied" : "empty",
        slot4: slot4 < 10 ? "occupied" : "empty",
        slot5: slot5 < 10 ? "occupied" : "empty",
    };

    const isChanged =
        newStatus.slot1 !== currentStatus.slot1 ||
        newStatus.slot2 !== currentStatus.slot2 ||
        newStatus.slot3 !== currentStatus.slot3 ||
        newStatus.slot4 !== currentStatus.slot4 ||
        newStatus.slot5 !== currentStatus.slot5;

    if (isChanged) {
        currentStatus = newStatus;
        broadcastStatus(currentStatus);
    }

    return response; // trả về cho controller
};

export const manualPlateCorrectionEntry = async (wrongPlate, correctPlate) => {
    try {
        // Tìm carId của biển số sai
        const wrongCar = await db.Car.findOne({
            where: {
                numberPlate: wrongPlate,
            },
            raw: false,
        });
        // Kiểm tra xem biển số đúng đã tồn tại chưa
        const checkResponse = await checkPlateExisted(correctPlate);
        let ticketTypeIn = "day";
        if (checkResponse.errCode === 1) {// Biển số đã tồn tại và có người dùng
            if (wrongCar) {
                // Xóa các bản ghi liên quan đến biển số sai
                await db.ParkingLog.destroy({ where: { carId: wrongCar.id } });
                await db.Ticket.destroy({ where: { carId: wrongCar.id } });
                await wrongCar.destroy();
            }
            // Kiểm tra xem vé tháng còn hạn hay không
            await createParkingLogs(checkResponse.carId);
            const ticketExisted = await checkMonthTicketExisted(checkResponse.carId);
            if (ticketExisted.errCode === 1) {
                // Vé đã tồn tại
                const currentDate = new Date();
                const endDate = new Date(ticketExisted.endDate);
                if (currentDate > endDate) {
                    console.log(`[Create Car] ❌ Vé đã hết hạn`);
                    await deleteTicketByCarId(checkResponse.carId);
                    console.log(
                        `[Create Car] ✅ Đã xóa vé tháng cũ cho biển số ${correctPlate}`
                    );
                    const ticket = await createNewTicket(checkResponse.carId);
                    console.log(
                        `[Create Car] ✅ Đã tạo vé ngày mới cho biển số ${correctPlate}`
                    );
                    ticketTypeIn = "day";
                } else {
                    console.log(`[Create Car] ✅ Vé còn hiệu lực, cho xe vào`);
                    ticketTypeIn = "month";
                }
            } else {
                // Vé chưa tồn tại
                console.log(`[Create Car] ❌ Vé chưa tồn tại`);
                const ticket = await createNewTicket(checkResponse.carId);
                console.log(
                    `[Create Car] ✅ Đã tạo vé ngày cho biển số ${correctPlate}`
                );
                ticketTypeIn = "day";
            }
        } else if (checkResponse.errCode === 2) {// Biển số tồn tại và chưa có người dùng
            ticketTypeIn = "day";
            if (wrongCar) {
                // Xóa các bản ghi liên quan đến biển số sai
                await db.ParkingLog.destroy({ where: { carId: wrongCar.id } });
                await db.Ticket.destroy({ where: { carId: wrongCar.id } });
                await wrongCar.destroy();
            }
            // Tạo mới vé ngày và parkingLogs 
            const carId = checkResponse.carId;
            await createParkingLogs(carId);
            await createNewTicket(carId);
        }
        else if (checkResponse.errCode === 0) {// Biển số chưa tồn tại và chưa có người dùng
            ticketTypeIn = "day";
            if (wrongCar) {
                // Xóa các bản ghi liên quan đến biển số sai
                await db.ParkingLog.destroy({ where: { carId: wrongCar.id } });
                await db.Ticket.destroy({ where: { carId: wrongCar.id } });
                await wrongCar.destroy();
            }
            // Tạo mới vé ngày và parkingLogs 
            const checkResponse1 = await axios.post(
                "http://localhost:6969/api/create-new-car",
                {
                    numberPlate: correctPlate
                }
            );
            const carId = checkResponse1.data.carId;
            await createParkingLogs(carId);
            await createNewTicket(carId);
        }
        broadcastStatus({
            openEntryServo: true,
            plate: correctPlate,
            ticketTypeIn: ticketTypeIn
        });
        return { success: true, message: "Đã sửa biển số và cập nhật dữ liệu" };
    } catch (err) {
        console.error("[Manual Plate Correction] ❌", err);
        return { success: false, message: "Lỗi khi sửa biển số" };
    }
};

export const manualPlateCorrectionExit = async (correctPlate) => {
    try {
        const carId = await findCarIdByPlate(correctPlate);
        if (!carId) {
            return { success: false, message: "Biển số không tồn tại" };
        }
        const isMonthTicket = await checkIfTicketTypeIsMonth(carId);
        if (isMonthTicket) {// Nếu là vé tháng
            console.log(
                `[Exit Car] ✅ Vé tháng, không tính phí cho biển số ${correctPlate}`
            );
            await updateCheckOutTimeAndFee(carId, 0);
            broadcastStatus({
                openExitServo: true,
                plate: correctPlate,
            });
        }
        else {// Nếu là vé ngày
            const timeDiff = await updateEndDate(carId);
            console.log(
                `[Exit Car] ✅ Vé ngày, đã tính phí cho biển số ${correctPlate}: ${timeDiff} ngày`,
            );
            const fee = 10000 * timeDiff;
            currentStatus.fee = fee;
            broadcastStatus(currentStatus);

            const userId = await userService.findUserIdByNumberPlate(correctPlate);
            const paymentResponse = await userService.payMoney(userId, fee);
            await updateCheckOutTimeAndFee(carId, fee);
            if (paymentResponse.errCode === 0) {
                console.log(
                    paymentResponse.errMessage
                );
                broadcastStatus({openExitServo: true, plate: correctPlate});
            }
            else {
                console.log(
                    paymentResponse.errMessage
                );
                currentStatus.cash = true;
                broadcastStatus(currentStatus);
            }
            // await updateCheckOutTimeAndFee(carId, fee);
        }
        // broadcastStatus(currentStatus);
        return { success: true, message: "Đã sửa biển số và cập nhật dữ liệu" };

    }
    catch (err) {
        console.error("[Manual Plate Correction] ❌", err);
        return { success: false, message: "Lỗi khi sửa biển số" };
    }
};

export const manualPaymentConfirm = async (fee, numberPlate) => {
    try {
        console.log("here");
        console.log(numberPlate, fee);
        const carId = await findCarIdByPlate(numberPlate);

        if (!carId) {
            return { errCode: 1, errMessage: "Biển số không tồn tại" };
        }

        const parkingLog = await updateCheckOutTimeAndFee(carId, fee);
        if (!parkingLog) {
            return { errCode: 2, errMessage: "Không tìm thấy bản ghi gửi xe" };
        }

        broadcastStatus({openExitServo: true, plate: numberPlate});

        return { errCode: 0, errMessage: "Thanh toán thành công" };
    } catch (err) {
        console.error("[Manual Payment Confirm] ❌", err);
        return { errCode: 4, errMessage: "Lỗi khi xác nhận thanh toán" };
    }
}

const broadcastStatus = (status) => {
    for (const client of wssClients) {
        if (client.readyState === 1) {
            client.send(JSON.stringify(status));
        }
    }
};
