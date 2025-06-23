// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let currentStatus = {
  slot1: 'empty',
  slot2: 'empty',
};

const captureImage = (device, folder) => {
  const filename = `photo_${Date.now()}.jpeg`;
  const filepath = path.join(__dirname, folder, filename);
  exec(`fswebcam -d ${device} -r 640x480 --no-banner --jpeg 95 ${filepath}`, (err) => {
    if (err) {
      console.error(`[CAM] Lỗi chụp ảnh từ ${device}:`, err.message);
    } else {
      console.log(`[CAM] Đã chụp ảnh và lưu tại ${filepath}`);
    }
  });
};

// Tạo thư mục nếu chưa có
['photos/entry', 'photos/exit'].forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify(currentStatus));
});

app.post('/update', (req, res) => {
  const { entry, exit, slot1, slot2 } = req.body;
  
  // Phát hiện biển số nếu có xe vào/ra
  if (entry < 50) {
    exec('conda run -n graduate python ../python/detect_plate.py 0 ./photos/entry', (err, stdout, stderr) => {
      if (err) console.error(`[Python Entry] ❌ ${stderr}`);
      else console.log(`[Python Entry] ✅ Biển số: ${stdout.trim()}`);
    });
  }

  if (exit < 50) {
    exec('conda run -n graduate python ../python/detect_plate.py 2 ./photos/exit', (err, stdout, stderr) => {
      if (err) console.error(`[Python Exit] ❌ ${stderr}`);
      else console.log(`[Python Exit] ✅ Biển số: ${stdout.trim()}`);
    });
  }

  // Cập nhật trạng thái bãi
  const newStatus = {
    slot1: slot1 < 50 ? 'occupied' : 'empty',
    slot2: slot2 < 50 ? 'occupied' : 'empty',
  };

  const isChanged =
    newStatus.slot1 !== currentStatus.slot1 ||
    newStatus.slot2 !== currentStatus.slot2;

  if (isChanged) {
    currentStatus = newStatus;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(currentStatus));
      }
    });
  }

  res.sendStatus(200);
});

server.listen(3000, () => console.log('Server running on port 3000'));
