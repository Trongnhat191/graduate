import parkingLogService from '../services/parkingLogService.js';

const handleGetParkingLogsByUserId = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Missing required parameter: userId',
            });
        }
        const result = await parkingLogService.getParkingLogsByUserId(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in handleGetParkingLogsByUserId controller: ', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export default {
    handleGetParkingLogsByUserId,
};