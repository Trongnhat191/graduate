import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
import { registerWSS } from './controllers/sensorController.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
dotenv.config();
let app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/photos', express.static('src/public/photos'));
viewEngine(app);
initWebRoutes(app);
connectDB();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
registerWSS(wss);

let port = process.env.PORT || 6969;
server.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
