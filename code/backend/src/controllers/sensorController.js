// backend/controllers/sensorController.js
import * as sensorService from '../services/sensorService.js';

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


export default {
  handleUpdate,
  registerWSS,
};
