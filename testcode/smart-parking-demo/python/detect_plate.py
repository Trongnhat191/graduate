import sys
import cv2
import torch
import time
from datetime import datetime
from ultralytics import YOLO
from paddleocr import PaddleOCR

total_start = time.time()

print("----------------------------")
camera_id = int(sys.argv[1])
folder = sys.argv[2]

### Load OCR model ###
start = time.time()
ocr = PaddleOCR(lang='vi')
print(f"✅ Load PaddleOCR: {time.time() - start:.2f}s")

### Load YOLO model ###
start = time.time()
model = YOLO('./../python/yolo_weights/best.pt').to('cuda')
print(f"✅ Load YOLO model: {time.time() - start:.2f}s")

### Capture image ###
start = time.time()
cap = cv2.VideoCapture(camera_id)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
ret, frame = cap.read()
cap.release()

if not ret:
    print("❌ Lỗi: Không thể chụp ảnh", file=sys.stderr)
    sys.exit(1)
print(f"📸 Chụp ảnh: {time.time() - start:.2f}s")

### Detect with YOLO ###
start = time.time()
results = model(frame)
boxes = results[0].boxes
print(f"🔍 YOLO detect: {time.time() - start:.2f}s")

### OCR with Paddle ###
start = time.time()
res = ocr.ocr(frame)
text = res[0][0][1][0] if res and res[0] else "Không đọc được"
print(f"🔡 PaddleOCR: {time.time() - start:.2f}s")
print(f"📃 Kết quả: {text}")

### Tổng thời gian ###
print(f"⏱️ Tổng thời gian: {time.time() - total_start:.2f}s")
