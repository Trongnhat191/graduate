// src/components/ParkingStatus.js
import React, { useEffect, useState } from 'react';
import './ParkingStatus.css'; // Tạo nếu bạn có style

function ParkingStatus() {
  const [status, setStatus] = useState({
    slot1: 'empty',
    slot2: 'empty',
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:6969'); // WebSocket server của bạn

    socket.onopen = () => {
      console.log('[CLIENT] WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[CLIENT] Nhận trạng thái:', data);
      setStatus(data);
    };

    return () => socket.close();
  }, []);

  const renderSlot = (slotNumber, state) => (
    <div className={`card ${state}`}>
      <div className="icon">🅿️</div>
      <div className="slot-label">Vị trí {slotNumber}</div>
      <div className="status-text">
        {state === 'occupied' ? 'Đang có xe' : 'Còn trống'}
      </div>
    </div>
  );

  return (
    <div className="parking-area">
      {/* <h2>Trạng thái bãi đỗ xe</h2> */}
      {/* <div className="slots"> */}
        {renderSlot(1, status.slot1)}
        {renderSlot(2, status.slot2)}
      {/* </div> */}
    </div>
  );
}

export default ParkingStatus;
