import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRevenueStatistics } from '../../services/statisticService';
import './StatisticRevenue.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
class StatisticRevenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            periodType: 'day',
            statistics: null,
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchStatistics();
    }

    handleDateChange = (date) => {
        if (date) {
            this.setState({ selectedDate: date, statistics: null, error: null });
        }
    };

    handlePeriodChange = (event) => {
        this.setState({ periodType: event.target.value, statistics: null, error: null });
    };

    formatDateForAPI = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    fetchStatistics = async () => {
        this.setState({ loading: true, error: null, statistics: null });
        const { periodType, selectedDate } = this.state;

        if (!selectedDate) {
            this.setState({ loading: false, error: "Vui lòng chọn ngày." });
            return;
        }

        const dateForAPI = this.formatDateForAPI(selectedDate);

        try {
            const response = await getRevenueStatistics(periodType, dateForAPI);
            if (response && response.success) {
                this.setState({ statistics: response.data, loading: false });
            } else {
                this.setState({ error: response.message || 'Không thể tải thống kê', loading: false });
            }
        } catch (err) {
            console.error("Error fetching statistics:", err);
            let errorMessage = 'Có lỗi xảy ra khi tải thống kê.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            this.setState({ error: errorMessage, loading: false });
        }
    };

    render() {
        const { periodType, selectedDate, statistics, loading, error } = this.state;

        return (
            <div className="statistic-revenue-container container mt-3">

                <h2 className="title text-center1 mb-4">Thống kê doanh thu</h2>

                <div className="controls card shadow-sm p-3 mb-4">
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label htmlFor="periodType">Loại kỳ:</label>
                            <select
                                id="periodType"
                                className="form-control"
                                value={periodType}
                                onChange={this.handlePeriodChange}
                            >
                                <option value="day">Ngày</option>
                                <option value="month">Tháng</option>
                                <option value="year">Năm</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="datePicker">Chọn ngày tham chiếu:</label>
                            <DatePicker
                                id="datePicker"
                                onChange={this.handleDateChange}
                                selected={this.state.selectedDate}
                                dateFormat={
                                    periodType === 'day'
                                        ? 'dd/MM/yyyy'
                                        : periodType === 'month'
                                            ? 'MM/yyyy'
                                            : 'yyyy'
                                }
                                showMonthYearPicker={periodType === 'month'}
                                showYearPicker={periodType === 'year'}
                            />
                            {/* <small className="form-text text-muted">
                                {periodType === 'day' && "Chọn ngày để xem doanh thu ngày đó."}
                                {periodType === 'month' && "Chọn một ngày trong tháng để xem doanh thu tháng đó."}
                                {periodType === 'year' && "Chọn một ngày trong năm để xem doanh thu năm đó."}
                            </small> */}
                        </div>
                        <div className="form-group col-md-4 d-flex align-items-end">
                            <button
                                className="btn btn-primary w-100"
                                onClick={this.fetchStatistics}
                                disabled={loading}
                            >
                                {loading ? 'Đang tải...' : 'Xem thống kê'}
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center alert alert-info">Đang tải dữ liệu...</p>}
                {error && <p className="text-center alert alert-danger">Lỗi: {error}</p>}

                {statistics && !loading && !error && (
                    <div className="results card shadow-sm p-3 mt-4">
                        <h4>Kết quả thống kê cho {
                            periodType === 'day' ? `ngày ${new Date(statistics.period.startDate).toLocaleDateString('vi-VN')}` :
                                periodType === 'month' ? `tháng ${new Date(statistics.period.startDate).getMonth() + 1}/${new Date(statistics.period.startDate).getFullYear()}` :
                                    `năm ${new Date(statistics.period.startDate).getFullYear()}`
                        }</h4>
                        <table className="table table-bordered table-hover mt-3">
                            <thead className="thead-light">
                                <tr>
                                    <th>Mục</th>
                                    <th>Doanh thu (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Doanh thu từ phí gửi xe (vé ngày/lượt)</td>
                                    <td>{statistics.parkingLogRevenue.toLocaleString('vi-VN')}</td>
                                </tr>
                                {/* <tr>
                                    <td>Doanh thu từ vé tháng (Mới/Gia hạn)</td>
                                    <td>{statistics.monthlyTicketRevenue ? statistics.monthlyTicketRevenue.toLocaleString('vi-VN') : 'N/A'}</td>
                                </tr> */}
                                <tr className="table-primary font-weight-bold">
                                    <td><strong>Tổng doanh thu</strong></td>
                                    <td><strong>{statistics.totalRevenue.toLocaleString('vi-VN')}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-muted"><small>Dữ liệu từ {new Date(statistics.period.startDate).toLocaleString('vi-VN')} đến {new Date(statistics.period.endDate).toLocaleString('vi-VN')}</small></p>
                        <p className="text-muted"><small>Ngày truy vấn: {statistics.period.queryDate}</small></p>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    // userInfo: state.user.userInfo, // Nếu cần
});

const mapDispatchToProps = dispatch => ({
    // actions if any
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticRevenue);