import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cors from 'cors';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import http from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

let app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);
connectDB();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
let currentStatus = {
    slot1: 'empty',
    slot2: 'empty',
  };
  
  // Tạo thư mục nếu chưa có
//   ['photos/entry', 'photos/exit'].forEach((dir) => {
//     const fullPath = path.join(__dirname, dir);
//     if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
//   });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.send(JSON.stringify(currentStatus));
  });
  
  app.post('/update', (req, res) => {
    const { entry, exit, slot1, slot2 } = req.body;
  
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
  let port = process.env.PORT || 6969;
server.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
