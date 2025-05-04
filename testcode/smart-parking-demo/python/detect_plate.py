# detect_plate.py
import sys
import cv2
import torch
import easyocr
from datetime import datetime

camera_id = int(sys.argv[1])
folder = sys.argv[2]

model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', force_reload=True)
reader = easyocr.Reader(['en'])

cap = cv2.VideoCapture(camera_id)
ret, frame = cap.read()
cap.release()

if not ret:
    print("error: Không thể chụp ảnh", file=sys.stderr)
    sys.exit(1)

results = model(frame)
detections = results.xyxy[0]

for det in detections:
    x1, y1, x2, y2, conf, cls = map(int, det[:6])
    plate_img = frame[y1:y2, x1:x2]
    result = reader.readtext(plate_img)
    plate_text = result[0][1] if result else 'unknown'

    time_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{folder}/plate_{time_str}_{plate_text}.jpg"
    cv2.imwrite(filename, plate_img)
    print(f"{plate_text}")
    break
