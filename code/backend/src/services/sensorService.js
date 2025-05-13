// backend/services/sensorService.js
import { exec } from 'child_process';

let currentStatus = {
  slot1: 'empty',
  slot2: 'empty',
};

const wssClients = new Set();

export const registerClient = (ws) => {
  ws.send(JSON.stringify(currentStatus));
  wssClients.add(ws);

  ws.on('close', () => {
    wssClients.delete(ws);
  });
};

export const processSensorData = ({ entry, exit, slot1, slot2 }) => {
  // Xử lý chụp ảnh và nhận diện biển số
  if (entry < 10) {
    exec('conda run -n graduate python src/python/detect_plate.py 0 src/photos/entry', (err, stdout, stderr) => {
      if (err) console.error(`[Python Entry] ❌ ${stderr}`);
      else console.log(`[Python Entry] ✅ Biển số: ${stdout.trim()}`);
    });
  }

  if (exit < 10) {
    exec('conda run -n graduate python src/python/detect_plate.py 2 src/photos/exit', (err, stdout, stderr) => {
      if (err) console.error(`[Python Exit] ❌ ${stderr}`);
      else console.log(`[Python Exit] ✅ Biển số: ${stdout.trim()}`);
    });
  }

  // Xử lý cập nhật trạng thái slot
  const newStatus = {
    slot1: slot1 < 50 ? 'occupied' : 'empty',
    slot2: slot2 < 50 ? 'occupied' : 'empty',
  };

  const isChanged =
    newStatus.slot1 !== currentStatus.slot1 ||
    newStatus.slot2 !== currentStatus.slot2;

  if (isChanged) {
    currentStatus = newStatus;
    broadcastStatus(currentStatus);
  }
};

const broadcastStatus = (status) => {
  for (const client of wssClients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(status));
    }
  }
};
