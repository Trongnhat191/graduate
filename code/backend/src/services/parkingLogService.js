import db from "../models/index.js";

const getParkingLogsByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing userId parameter",
                    logs: [],
                });
                return;
            }
            // console.log("Fetching parking logs for user ID:", userId);
            const parkingLogInstances = await db.ParkingLog.findAll({
                attributes: ['id', 'checkInTime', 'checkOutTime'], // Removed carId as it's part of the 'car' include
                include: [
                    {
                        model: db.Car,
                        as: 'car',
                        attributes: ['id', 'numberPlate', 'userId'], // Include car.id for ticket query
                        where: { userId: userId },
                        required: true,
                    },
                ],
                order: [['checkInTime', 'DESC']],
                raw: false, // Set to false to get Sequelize instances
            });

            if (!parkingLogInstances || parkingLogInstances.length === 0) {
                resolve({
                    errCode: 0,
                    errMessage: "No parking logs found for this user.",
                    logs: [],
                });
                return;
            }

            const augmentedLogs = await Promise.all(parkingLogInstances.map(async (logInstance) => {
                const log = logInstance.toJSON(); // Convert Sequelize instance to plain object
                let ticketType = 'N/A'; 

                if (log.car && log.car.id && log.checkInTime) {
                    const ticket = await db.Ticket.findOne({
                        where: {
                            carId: log.car.id,
                            startDate: { [db.Sequelize.Op.lte]: log.checkInTime },
                            [db.Sequelize.Op.or]: [
                                { endDate: { [db.Sequelize.Op.gte]: log.checkInTime } },
                                { endDate: null }
                            ]
                        },
                        order: [['createdAt', 'DESC']], 
                        attributes: ['ticketType'],
                        raw: true,
                    });
                    if (ticket) {
                        ticketType = ticket.ticketType;
                    }
                }
                return {
                    id: log.id,
                    numberPlate: log.car ? log.car.numberPlate : 'N/A',
                    checkInTime: log.checkInTime,
                    checkOutTime: log.checkOutTime,
                    ticketType: ticketType,
                };
            }));

            resolve({
                errCode: 0,
                errMessage: "OK",
                logs: augmentedLogs,
            });

        } catch (e) {
            console.error("Error in getParkingLogsByUserId: ", e);
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

export default {
    getParkingLogsByUserId,
};