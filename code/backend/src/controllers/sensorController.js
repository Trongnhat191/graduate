// backend/controllers/sensorController.js
import * as sensorService from "../services/sensorService.js";
import { manualPlateCorrectionEntry , manualPlateCorrectionExit} from "../services/sensorService.js";

export const registerWSS = (wss) => {
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    sensorService.registerClient(ws);
  });
};

export const handleUpdate = async (req, res) => {
  const result = await sensorService.processSensorData(req.body);
  res.json(result); // Gửi phản hồi JSON về cho ESP32
};

export const handlemanualPlateCorrectionEntry = async (req, res) => {

  const { wrongPlate, correctPlate } = req.body;
  const result = await manualPlateCorrectionEntry(wrongPlate, correctPlate);
  res.json(result);
};

export const handlemanualPlateCorrectionExit = async (req, res) => {
  const {correctPlate } = req.body;
  const result = await manualPlateCorrectionExit(correctPlate);
  res.json(result);
};

export const handleManualPaymentConfirm = async (req, res) => {
  const { fee, numberPlate } = req.body;
  const result = await sensorService.manualPaymentConfirm(fee, numberPlate);
  res.json(result);
};

export default {
  handleUpdate,
  registerWSS,
  handlemanualPlateCorrectionEntry,
  handlemanualPlateCorrectionExit,
  handleManualPaymentConfirm
};
