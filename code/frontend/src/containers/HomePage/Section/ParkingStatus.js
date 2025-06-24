// src/components/ParkingStatus.js
import React, { Component } from 'react';
import './ParkingStatus.scss';

class ParkingStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                slot1: 'empty',
                slot2: 'empty',
                slot3: 'empty',
                slot4: 'empty',
                slot5: 'empty'
            }
        };
        this.socket = null;
    }

    componentDidMount() {
        this.socket = new WebSocket('ws://localhost:6969');

        this.socket.onopen = () => {
            console.log('[CLIENT] WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.setState({ status: data });
        };
    }

    componentWillUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    }

    renderSlot(slotNumber, state) {
        return (
            <div className={`card ${state}`} key={slotNumber}>
                <div className="icon"><img src="/images.png" alt="car" /></div>
                {/* <div className="slot-label">Vị trí {slotNumber}</div> */}
                <div className="status-text">
                    {state === 'occupied' ? 'Đang có xe' : 'Còn trống'}
                </div>
            </div>
        );
    }

    render() {
        const { slot1, slot2, slot3, slot4, slot5 } = this.state.status;

        return (
            <div className='parking-area'>
                <div className="parking-top">
                        Hello, Parking Status
                    </div>
                <div className='parking-container'>
                    
                    <div className="parking-slot">
                        {this.renderSlot(5, slot4)}
                        {this.renderSlot(4, slot3)}
                        {this.renderSlot(3, slot5)}
                        {this.renderSlot(2, slot2)}
                        {this.renderSlot(1, slot1)}
                    </div>
                </div>
                <div className='parking-entrance'>
                    <div className='outside-left'>

                    </div>
                    <div className='exit-way'>
                        <span className="arrow-icon exit">
                            <i className="fas fa-arrow-down"></i>
                        </span>
                    </div>
                    <div className='entry-way'>
                        <span className="arrow-icon entry">
                            <i className="fas fa-arrow-up"></i>
                        </span>
                    </div>
                    <div className='outside-right'>

                    </div>
                </div>
            </div>


        );
    }
}

export default ParkingStatus;
