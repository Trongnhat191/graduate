import db from '../models/index.js';
import { Op } from 'sequelize';

const getParkingLogRevenue = async (startDate, endDate) => {
    try {
        const result = await db.ParkingLog.sum('fee', {
            where: {
                checkOutTime: {
                    [Op.between]: [startDate, endDate],
                },
                fee: {
                    [Op.ne]: null,
                    [Op.gt]: 0
                }
            },
        });
        return {
            success: true,
            totalRevenue: result || 0,
        };
    } catch (error) {
        console.error("Error in getParkingLogRevenue: ", error);
        return {
            success: false,
            message: "Error fetching parking log revenue.",
            error: error.message
        };
    }
};

const getMonthlyTicketRevenue = async (startDate, endDate) => {
    try {
        const result = await db.Ticket.sum('price', {
            where: {
                ticketType: 'month',
                startDate: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
        return {
            success: true,
            totalRevenue: result || 0,
        };
    } catch (error) {
        console.error("Error in getMonthlyTicketRevenue: ", error);
        return {
            success: false,
            message: "Error fetching monthly ticket revenue.",
            error: error.message
        };
    }
};

const getRevenueStatistics = async (periodType, dateString) => {
    let startDate, endDate;
    const targetDate = new Date(dateString);

    if (isNaN(targetDate.getTime())) {
        return { success: false, message: "Invalid date provided." };
    }

    if (periodType === 'day') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
    } else if (periodType === 'month') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (periodType === 'year') {
        startDate = new Date(targetDate.getFullYear(), 0, 1, 0, 0, 0, 0);
        endDate = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        return { success: false, message: "Invalid period type." };
    }

    try {
        const parkingLogRevenueResult = await getParkingLogRevenue(startDate, endDate);
        const monthlyTicketRevenueResult = await getMonthlyTicketRevenue(startDate, endDate);

        if (!parkingLogRevenueResult.success) {
            return { success: false, message: "Failed to fetch revenue components." };
        }

        const totalRevenue = parkingLogRevenueResult.totalRevenue+ (monthlyTicketRevenueResult.totalRevenue || 0);
        
        return {
            success: true,
            data: {
                period: {
                    type: periodType,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    queryDate: dateString
                },
                parkingLogRevenue: parkingLogRevenueResult.totalRevenue,
                monthlyTicketRevenue: monthlyTicketRevenueResult.totalRevenue, // Future
                totalRevenue: totalRevenue,
            },
        };
    } catch (error) {
        console.error("Error in getRevenueStatistics: ", error);
        return { success: false, message: "Error calculating revenue statistics.", error: error.message };
    }
};

export default {
    getRevenueStatistics,
};