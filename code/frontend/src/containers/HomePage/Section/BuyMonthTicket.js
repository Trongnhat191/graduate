import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMomoPayment, getTicketInfoByNumberPlate, getMonthTicketInfoByNumberPlate } from '../../../services/paymentService';
import './BuyMonthTicket.scss';
class BuyMonthTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
            month: 1,
            totalPrice: 100000,
            payUrl: '',
            userId: '',
            numberPlate: '',
            endDate: '',
        }
    }

    componentDidMount() {
        const {userInfo} = this.props;
        const pricePerMonth = 100000;

        if (userInfo) {
            this.setState({
                userId: userInfo.id,
                numberPlate: userInfo['cars.numberPlate'],
                totalPrice: this.state.month * pricePerMonth
            }, () => {
                if (this.state.numberPlate) {
                    this.handleGetTicketInfo(this.state.numberPlate);
                }
            })
        }
    }

    pay = async (data) => {
        // console.log("check data from pay", data);
        let res = await createMomoPayment(data);
        // console.log("check res from pay", res);
        this.setState({
            payUrl: res.payUrl
        })
        if (this.state.numberPlate){
            this.handleGetTicketInfo(this.state.numberPlate);
        }
    }

    handleOnChangeMonth = (event) => {
        const pricePerMonth = 100000;
        let month = Number(event.target.value);
        if (month < 1) {
            month = 1;
        }
        const totalPrice = month * pricePerMonth;
        this.setState({
            month: month,
            totalPrice: totalPrice
        })
    }

    handleGetTicketInfo = async (numberPlate) => {
        let res = await getMonthTicketInfoByNumberPlate(numberPlate);
        console.log("check res from getMonthTicketInfoByNumberPlate", res);
        if (res && res.errCode === 0) {
            this.setState({
                endDate: res.monthTicketInfo.endDate,
            })
        } else {
            this.setState({
                endDate: '',
            });
            console.error("Error fetching ticket info:", res.errMessage);
        }
    }

    render() {
        return (
            
            <div className="text-center">
                <div className='current-ticket-info'>
                    <h3>Thông tin vé hiện tại</h3>
                    <p>Biển số xe: {this.state.numberPlate}</p>
                    <p>Ngày hết hạn vé: {this.state.endDate ? this.state.endDate.substring(0, 10) : "Chưa mua vé"}</p>

                </div>
                <div className="form-group">
                    <span>
                        <label htmlFor="month">Số tháng</label>
                        <input
                            type="number"
                            className="form-control"
                            id="month"
                            min="1"
                            value={this.state.month}
                            onChange={this.handleOnChangeMonth}
                        />
                    </span>
                    <span className='price-per-month'>
                        Đơn giá: 100000/tháng
                    </span>
                </div>

                <div className="form-group">
                    <span>
                        <strong>Tổng tiền: {this.state.totalPrice.toLocaleString()} VNĐ</strong>
                    </span>
                </div>

                <button className="btn btn-primary" onClick={() => this.pay({...this.state, userId: this.state.userId})} disabled={!this.state.numberPlate}>
                    Thanh toán
                </button>
                <div className='pay-url'>
                    <h3>Pay URL:</h3>
                    {this.state.payUrl && (
                        <div>
                            <a href={this.state.payUrl} target="_blank" rel="noopener noreferrer">
                                {this.state.payUrl}
                            </a>
                        </div>
                    )}
                </div>
                
                {/* {console.log("check payUrl", this.state.payUrl)} */}

            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        // Các state từ Redux store mà component này cần sử dụng
        // userId: state.user.userInfo.id,
        // numberPlate: state.user.userInfo['cars.numberPlate'],
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyMonthTicket);
