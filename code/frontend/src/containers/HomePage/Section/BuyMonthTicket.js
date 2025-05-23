import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMomoPayment } from '../../../services/paymentService';
import './BuyMonthTicket.scss';
class BuyMonthTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
            month: 1,
            totalPrice: 10000,
            payUrl: '',
        }
    }

    componentDidMount() {
        const pricePerMonth = 10000;
        this.setState({
            totalPrice: this.state.month * pricePerMonth
        })
    }

    pay = async (data) => {
        // console.log("check data from pay", data);
        let res = await createMomoPayment(data);
        // console.log("check res from pay", res);
        this.setState({
            payUrl: res.payUrl
        })
    }

    handleOnChangeMonth = (event) => {
        const pricePerMonth = 10000;
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
    render() {
        return (
            
            <div className="text-center">
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
                    <span>
                        Đơn giá: 10000/tháng
                    </span>
                </div>

                <div className="form-group">
                    <span>
                        <strong>Tổng tiền: {this.state.totalPrice.toLocaleString()} VNĐ</strong>
                    </span>
                </div>

                <button className="btn btn-primary" onClick={() => this.pay({...this.state, userId: this.props.userId})}>
                    Thanh toán
                </button>
                {this.state.payUrl && (
                    <div>
                        <h3>Pay URL:</h3>
                        <a href={this.state.payUrl} target="_blank" rel="noopener noreferrer">
                            {this.state.payUrl}
                        </a>
                    </div>
                )}
                {/* {console.log("check payUrl", this.state.payUrl)} */}

            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        // Các state từ Redux store mà component này cần sử dụng
        userId: state.user.userInfo.id,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyMonthTicket);
