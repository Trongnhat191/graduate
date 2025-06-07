import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getParkingLogsByUserId } from '../../../services/parkingLogService';
import moment from 'moment';
import './UserHistory.scss';

class UserHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingLogs: [],
            isLoading: false,
            error: null,
        };
    }

    async componentDidMount() {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            this.setState({ isLoading: true });
            try {
                // console.log("Fetching parking logs for user ID:", userInfo.id);
                const response = await getParkingLogsByUserId(userInfo.id);
                if (response && response.errCode === 0) {
                    this.setState({ parkingLogs: response.logs, isLoading: false });
                } else {
                    this.setState({ error: response.errMessage || 'Failed to fetch history', isLoading: false });
                }
            } catch (e) {
                console.error("Error fetching parking logs:", e);
                this.setState({ error: 'An error occurred while fetching history.', isLoading: false });
            }
        } else {
            this.setState({ error: 'User information not available. Please log in.', isLoading: false });
        }
    }

    formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return moment(dateTime).format('DD/MM/YYYY HH:mm:ss');
    }

    render() {
        const { parkingLogs, isLoading, error } = this.state;

        if (isLoading) {
            return <div className="history-container text-center">Loading history...</div>;
        }

        if (error) {
            return <div className="history-container text-center error-message">Error: {error}</div>;
        }

        if (!parkingLogs || parkingLogs.length === 0) {
            return <div className="history-container text-center">No parking history found.</div>;
        }

        return (
            <div className="history-container">
                <h3 className="text-center">Parking History</h3>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Number Plate</th>
                            <th>Check-In Time</th>
                            <th>Check-Out Time</th>
                            <th>Ticket Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parkingLogs.map(log => (
                            <tr key={log.id}>
                                <td>{log.numberPlate}</td>
                                <td>{this.formatDateTime(log.checkInTime)}</td>
                                <td>{this.formatDateTime(log.checkOutTime)}</td>
                                <td>{log.ticketType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

export default connect(mapStateToProps)(UserHistory);