// backend/controllers/sensorController.js
import * as sensorService from '../services/sensorService.js';

export const registerWSS = (wss) => {
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    sensorService.registerClient(ws);
  });
};

export const handleUpdate = (req, res) => {
  sensorService.processSensorData(req.body);
  res.sendStatus(200);
};

export default {
  handleUpdate,
  registerWSS,
};
