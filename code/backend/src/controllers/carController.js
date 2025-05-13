import carService from "../services/carService.js";

let handleCreateNewCar = async (req, res) => {
    let message = await carService.createNewCar(req.body);
    return res.status(200).json({
        errCode: message.errCode,
        message: message.errMessage
    });
}

export default {
    handleCreateNewCar: handleCreateNewCar
}