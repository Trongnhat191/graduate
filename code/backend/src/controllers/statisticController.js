// filepath: /home/nhat/Documents/graduate/code/backend/src/controllers/statisticController.js
import statisticService from '../services/statisticService.js';

const handleGetRevenueStatistics = async (req, res) => {
    const { periodType, date } = req.query; 

    if (!periodType || !date) {
        return res.status(400).json({
            success: false,
            message: "Missing 'periodType' or 'date' query parameters.",
        });
    }

    try {
        const result = await statisticService.getRevenueStatistics(periodType, date);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            // Send 200 for logical errors handled by service, or 500 for unexpected
            return res.status(result.message.includes("Invalid") ? 400 : 500).json(result);
        }
    } catch (error) {
        console.error("Controller error in handleGetRevenueStatistics: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in controller.",
            error: error.message
        });
    }
};

export default {
    handleGetRevenueStatistics,
};