import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import "./Header.scss";

// Tạo menu riêng cho staff nếu cần
const staffMenu = [
    {
        name: <i className="fas fa-bars"></i>,
        menus: [
            {
                name: 'Quản lý vào ra',
                link: '/system/staff-manage'
            }
        ]
    },
];

class StaffHeader extends Component {
    render() {
        const { processLogout } = this.props;
        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={staffMenu} />
                </div>
                <div className="btn btn-logout" onClick={processLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
});
const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(StaffHeader);