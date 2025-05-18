import carService from "../services/carService.js";

let handleCreateNewCar = async (req, res) => {
    let message = await carService.createNewCar(req.body);
    return res.status(200).json({
        carId: message.carId,
        errCode: message.errCode,
        message: message.errMessage
    });
}

let handleCheckPlate = async (req, res) => {
    let plate = req.params.plate;
    let message = await carService.checkPlate(plate);
    return res.status(200).json({
        carId: message.carId,
        errCode: message.errCode,
        message: message.errMessage
    });
}

let handleCreateParkingLogs = async (req, res) => {
    let data = req.body;
    // console.log("data from client: ", data);
    let message = await carService.createParkingLogs(data);
    return res.status(200).json({
        errCode: 0,
        message: 'OK'
    });
}
export default {
    handleCreateNewCar: handleCreateNewCar,
    handleCheckPlate: handleCheckPlate,
    handleCreateParkingLogs: handleCreateParkingLogs
}