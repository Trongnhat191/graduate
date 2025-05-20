import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import ProductManage from '../containers/System/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Header from '../containers/Header/Header';
import StaffManage from '../containers/System/StaffManage';
import StaffHeader from '../containers/Header/StaffHeader';
import StaffHistory from '../containers/System/StaffHistory';
class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        const { role } = userInfo;
        // console.log("props from System.js", this.props);
        return (
            <React.Fragment>
                {isLoggedIn &&  (
                    role === "staff" ? <StaffHeader /> : <Header />
                )}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/product-manage" component={ProductManage} />
                            <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} />
                            <Route path="/system/staff-manage" component={StaffManage} />
                            <Route path="/system/staff-history" component={StaffHistory} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
