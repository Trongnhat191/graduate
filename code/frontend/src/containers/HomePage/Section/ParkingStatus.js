// src/components/ParkingStatus.js
import React, { useEffect, useState } from 'react';
import './ParkingStatus.scss'; // Tạo nếu bạn có style

function ParkingStatus() {
  const [status, setStatus] = useState({
    slot1: 'empty',
    slot2: 'empty',
    slot3: 'empty',
    slot4: 'empty',
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
      <div className="icon"><img src = "/images.png"/></div>
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
        {renderSlot(4, status.slot4)}
        {renderSlot(3, status.slot3)}
        {renderSlot(2, status.slot2)}
        {renderSlot(1, status.slot1)}
      {/* </div> */}
    </div>
  );
}

export default ParkingStatus;
