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

export const processSensorData = async ({ entry, exit, slot1, slot2 }) => {
    const response = {
      openEntryServo: false,
      openExitServo: false,
    };
  
    // Xử lý entry
    if (entry < 10) {
      response.openEntryServo = true;
      exec('conda run -n graduate python src/python/detect_plate.py 2 src/photos/entry', (err, stdout, stderr) => {
        if (err) console.error(`[Python Entry] ❌ ${stderr}`);
        else console.log(`[Python Entry] ✅ Biển số: ${stdout.trim()}`);
      });
    }
  
    // Xử lý exit
    if (exit < 10) {
      response.openExitServo = true;
      exec('conda run -n graduate python src/python/detect_plate.py 4 src/photos/exit', (err, stdout, stderr) => {
        if (err) console.error(`[Python Exit] ❌ ${stderr}`);
        else console.log(`[Python Exit] ✅ Biển số: ${stdout.trim()}`);
      });
    }
  
    // Xử lý cập nhật trạng thái chỗ đỗ
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
  
    return response; // trả về cho controller
  };
  

const broadcastStatus = (status) => {
  for (const client of wssClients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(status));
    }
  }
};
