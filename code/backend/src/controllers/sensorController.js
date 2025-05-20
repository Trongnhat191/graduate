// backend/controllers/sensorController.js
import * as sensorService from '../services/sensorService.js';
import { manualPlateCorrection } from '../services/sensorService.js';

export const registerWSS = (wss) => {
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    sensorService.registerClient(ws);
  });
};

export const handleUpdate = async (req, res) => {
  const result = await sensorService.processSensorData(req.body);
  res.json(result); // Gửi phản hồi JSON về cho ESP32
};

export const handleManualPlateCorrection = async (req, res) => {
  const { wrongPlate, correctPlate } = req.body;
  const result = await manualPlateCorrection(wrongPlate, correctPlate);
  res.json(result);
};

export default {
  handleUpdate,
  registerWSS,
  handleManualPlateCorrection,
};
