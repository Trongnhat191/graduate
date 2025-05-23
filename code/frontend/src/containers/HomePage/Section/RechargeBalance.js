import React, { Component } from 'react';
import { connect } from 'react-redux';
import './RechargeBalance.scss';
import { rechargeBalance } from '../../../services/paymentService';
import {getUserInfoById}  from '../../../services/userService';
class RechargeBalance extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            amount: '',
            message: '',
            loading: false,
            userId: '',
            payUrl: '',
            balance: props.userInfo ? props.userInfo.balance : 0,
        }
    }

    componentDidMount() {
        const {userInfo} = this.props;
        console.log("check userInfo", userInfo);
        if (userInfo) {
            this.setState({
                userId: userInfo.id,
            }, () => {
                this.handleGetUserInfo(this.state.userId);
            })
        }
    }



    pay = async (data) => {
        this.setState({ loading: true, message: '' }); // Đặt loading true và xóa message cũ
        try {
            let res = await rechargeBalance(data);

            console.log("check res from pay", res);
            this.setState({
                payUrl: res.payUrl,
                message: res.message,
                loading: false,
            });
            // Chỉ gọi handleGetUserInfo nếu rechargeBalance thành công (ví dụ: có payUrl)
            if (res && res.payUrl) {
                this.handleGetUserInfo(this.state.userId);
            }
        } catch (error) {
            console.error("Error during payment:", error);
            this.setState({
                message: "Đã có lỗi xảy ra trong quá trình xử lý thanh toán.",
                loading: false,
            });
        }
    }

    handleGetUserInfo = async  (userId) => {
        let res = await getUserInfoById(userId);
        console.log("check res from getUserInfoById", res);
        if (res && res.errCode === 0) {
            this.setState({
                balance: res.user.balance,
            })
        } else { 
            alert(res.errMessage);
        }
    }
    handleInputChange = (event) => {
        this.setState({ amount: event.target.value });
    }
    render() {
        // const { balance } = this.props.userInfo;
        const { amount, loading, message, balance} = this.state;
        return (
            <div className="recharge-balance-container">
                <h3>Số dư hiện tại: <span className="balance">{balance} VNĐ</span></h3>
                <div className="recharge-form">
                    <input
                        type="number"
                        placeholder="Nhập số tiền muốn nạp"
                        value={amount}
                        onChange={this.handleInputChange}
                        min="10000"
                        step="1000"
                        disabled={loading}
                    />
                    <button onClick={() => this.pay({...this.state, userId: this.state.userId})} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Nạp tiền'}
                    </button>
                </div>
                {message && <div className="message">{message}</div>}
                {this.state.payUrl && (
                    <div>
                        <h3>Pay URL:</h3>
                        <a href={this.state.payUrl} target="_blank" rel="noopener noreferrer">
                            {this.state.payUrl}
                        </a>
                    </div>
                )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        // Các state từ Redux store mà component này cần sử dụng
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RechargeBalance);
