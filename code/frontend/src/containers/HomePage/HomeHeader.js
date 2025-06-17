import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
        };
    }

    toggleMenu = () => {
        // console.log("Toggle menu", this.state.showMenu);
        this.setState((prevState) => ({
            showMenu: !prevState.showMenu,
        }));
    };

    render() {
        const { isLoggedIn, userInfo } = this.props;
        const { processLogout } = this.props;
        return (
            <div className="home-header-container">
                <div className="home-header-content">
                    <div className="left-content">
                        {/* <div className="left-content"> */}
                            <span className="home-logo" onClick={() => this.props.onChangeView("Parking")}>
                                Smart Parking
                            </span>
                        {/* </div> */}

                    </div>
                    <div className="center-content"></div>
                    <div className="right-content">
                        <div className="login-button">
                            {!isLoggedIn ? (
                                <div className="login-button-wrapper">
                                    <a href="/login" className="login">Đăng nhập</a>
                                    <div className="link-separator"></div>
                                    <a href="/register" className="register">Đăng ký</a>
                                </div>
                            ) : (
                                <div className="user-menu-wrapper">
                                    <span className="greeting-text">
                                        Xin chào, <strong>{userInfo?.fullName || "Người dùng"}</strong>
                                    </span>
                                    <span className="user-icon" onClick={this.toggleMenu}>
                                        <i className="fas fa-user-circle"></i>
                                    </span>
                                    {this.state.showMenu && (
                                        <div className="user-dropdown-menu">
                                            <a className="dropdown-item" onClick={this.props.onShowProfile}>Thông tin cá nhân</a>
                                            <a className="dropdown-item" onClick={() => this.props.onChangeView("BuyMonthTicket")}>Mua vé tháng</a>
                                            <a className="dropdown-item" onClick={() => this.props.onChangeView("RechargeBalance")}>Nạp tiền vé ngày</a>
                                            <a className="dropdown-item" onClick={() => this.props.onChangeView("History")}>Lịch sử</a>
                                            <a className="dropdown-item" onClick={() => { processLogout(); this.props.onChangeView("Parking"); }}>Đăng xuất</a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
