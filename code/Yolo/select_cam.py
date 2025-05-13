import cv2
import os
from datetime import datetime

def list_cameras(max_cameras=5):
    available_cameras = []
    for i in range(max_cameras):
        cap = cv2.VideoCapture(i)
        if cap is not None and cap.isOpened():
            available_cameras.append(i)
            cap.release()
    return available_cameras

def open_camera(camera_index):
    cap = cv2.VideoCapture(camera_index)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))

    if not cap.isOpened():
        print(f"Cannot open camera {camera_index}")
        return

    print(f"Camera {camera_index} opened successfully.")

    # Tạo thư mục lưu ảnh nếu chưa có
    save_dir = "video_frames"
    os.makedirs(save_dir, exist_ok=True)

    frame_count = 0  # đếm số ảnh đã lưu

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Can't receive frame (stream end?). Exiting...")
            break

        cv2.imshow(f'Camera {camera_index}', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            # Chụp và lưu ảnh
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = os.path.join(save_dir, f"frame_{timestamp}_{frame_count}.png")
            cv2.imwrite(filename, frame)
            print(f"Saved {filename}")
            frame_count += 1

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    cameras = list_cameras()

    if not cameras:
        print("No camera found.")
    else:
        print("Available cameras:")
        for idx in cameras:
            print(f"- Camera {idx}")

        cam_idx = int(input("Enter camera index to open: "))
        if cam_idx in cameras:
            open_camera(cam_idx)
        else:
            print("Invalid camera index selected.")
