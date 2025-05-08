import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import "./Login.scss";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //Chứa các biến muốn quản lý State
            username: "",
            password: "",
            isShowPassword: false,
        };
    }

    handleOnChaneUsername = (event) => {
        this.setState({
            username: event.target.value,
        });
    };

    handleOnChanePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    handleLogin = () => {
        // console.log('check username', this.state.username);
        // console.log('check password', this.state.password);
        this.props.userLoginSuccess({
            username: this.state.username,
            password: this.state.password,
        });
    };

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    }
    render() {
        // hàm render chỉ render 1 khối
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 text-login">Login</div>
                        <div className="col-12 form-group login-input">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                // gia tri của this.state.username sẽ hiện ở trên Username của web
                                value={this.state.username}
                                onChange={(event) => this.handleOnChaneUsername(event)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    onChange={(event) => this.handleOnChanePassword(event)}
                                ></input>
                                <span onClick = {() => this.handleShowPassword()}>
                                    <i class={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={() => {
                                    this.handleLogin();
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) =>
            dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
