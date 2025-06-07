import * as sensorService from "../services/sensorService.js";
import { manualPlateCorrectionEntry , manualPlateCorrectionExit } from "../services/sensorService.js";

export const registerWSS = (wss) => {
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    sensorService.registerClient(ws);

    ws.on('message', async (message) => {
      try {
        const msg = message.toString();
        // console.log("Received message from client:", msg);
        let data;
        try {
          data = JSON.parse(msg);
          await sensorService.processSensorData(data, ws); // Gọi hàm xử lý dữ liệu cảm biến
        } catch (err) {
          console.error("Invalid JSON from client:", msg);
          return;
        }

        // Nếu message có đủ trường cảm biến thì xử lý như ESP32 gửi lên
        if (
          typeof data.slot1 !== "undefined" &&
          typeof data.slot2 !== "undefined" &&
          typeof data.slot3 !== "undefined" &&
          typeof data.slot4 !== "undefined" &&
          typeof data.slot5 !== "undefined" &&
          typeof data.entry !== "undefined" &&
          typeof data.exit !== "undefined"
        ) {
          // Đây là dữ liệu từ ESP32
          const result = await sensorService.processSensorData(data);
          // Gửi lại kết quả cho ESP32 (lệnh mở/đóng servo)
          if (ws.readyState === 1) ws.send(JSON.stringify(result));
        }
        // Nếu muốn, bạn có thể xử lý các loại message khác ở đây (ví dụ: lệnh từ frontend)
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on('error', (err) => {
      console.error("WebSocket error:", err);
    });
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
  // console.log("check data from handleManual", fee, numberPlate);
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
