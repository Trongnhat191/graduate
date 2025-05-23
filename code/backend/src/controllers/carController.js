import carService from "../services/carService.js";

let handleCreateNewCar = async (req, res) => {
    let message = await carService.createNewCar(req.body);
    return res.status(200).json({
        carId: message.carId,
        errCode: message.errCode,
        message: message.errMessage
    });
}

let handleGetTicketInfoByNumberPlate = async (req, res) => {
    // console.log('check req.query', req.query);
    let numberPlate = req.query.numberPlate;
    if (!numberPlate) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        });
    }
    let message = await carService.getTicketInfoByNumberPlate(numberPlate);
    // console.log('check message', message);
    return res.status(200).json({
        errCode: message.errCode,
        errMessage: message.errMessage,
        ticketInfo: message.ticketInfo ? message.ticketInfo : {}
    });
}

export default {
    handleCreateNewCar: handleCreateNewCar,
    handleGetTicketInfoByNumberPlate: handleGetTicketInfoByNumberPlate

}