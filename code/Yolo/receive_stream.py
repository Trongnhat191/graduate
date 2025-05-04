import cv2

cap = cv2.VideoCapture(2)
frame_id = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Không đọc được frame")
        break

    cv2.imshow("Webcam", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        filename = f"video_frames/saved_frame_{frame_id:03d}.jpg"
        cv2.imwrite(filename, frame)
        print(f"💾 Đã lưu {filename}")
        frame_id += 1

    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
