import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState({
    slot1: 'empty',
    slot2: 'empty',
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

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
    <div className="App">
      <h1>Bãi đỗ xe thông minh 🚗</h1>
      <div className="parking-area">
        {renderSlot(1, status.slot1)}
        {renderSlot(2, status.slot2)}
      </div>
    </div>
  );
}

export default App;
