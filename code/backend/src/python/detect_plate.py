import sys
import cv2
import torch
import time
from datetime import datetime
from ultralytics import YOLO
from paddleocr import PaddleOCR
import re

# total_start = time.time()

# print("----------------------------")
camera_id = int(sys.argv[1])
folder = sys.argv[2]

### Load OCR model ###
# start = time.time()
ocr = PaddleOCR(lang='vi', show_log = False)
# print(f"✅ Load PaddleOCR: {time.time() - start:.2f}s")

### Load YOLO model ###
# start = time.time()
model = YOLO('src/python/yolo_weights/best.pt').to('cuda')
# print(f"✅ Load YOLO model: {time.time() - start:.2f}s")

### Capture image ###
# start = time.time()
cap = cv2.VideoCapture(camera_id)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
ret, frame = cap.read()
cap.release()

### Save image ###
if ret:
    # filename = f"{folder}/{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpeg"
    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpeg"
    filepath = f"{folder}/{filename}"
    cv2.imwrite(filepath, frame)
    print(filename)

if not ret:
    # print("❌ Lỗi: Không thể chụp ảnh", file=sys.stderr)
    sys.exit(1)
# print(f"📸 Chụp ảnh: {time.time() - start:.2f}s")

### Detect with YOLO ###
# start = time.time()
results = model(frame, verbose=False)
boxes = results[0].boxes
# print(f"🔍 YOLO detect: {time.time() - start:.2f}s")

### OCR with Paddle ###
# start = time.time()
x1, y1, x2, y2 = map(int, boxes.xyxy[0])
cut_img = frame[y1:y2, x1:x2]
res = ocr.ocr(cut_img)
text = ""
for line in res:
    for word in line:
        if word[1][1] > 0.5:  # Confidence threshold
            text+= word[1][0]
# text = res[0][0][1][0] if res and res[0] else "Không đọc được"
text = re.sub(r'[^A-Za-z0-9]', '', text)
# print(f"🔡 PaddleOCR: {time.time() - start:.2f}s")
# print(f"📃 Kết quả: {text}")
print(text)
### Tổng thời gian ###
# print(f"⏱️ Tổng thời gian: {time.time() - total_start:.2f}s")
