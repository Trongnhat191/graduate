import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions/index.js";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService.js";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Chứa các biến muốn quản lý State
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
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

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      // console.log("data from handleLogin", data);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
        if (data.user.role === "admin") {
          this.props.navigate("/system/user-manage");
        } else if (data.user.role === "user") {
          this.props.navigate("/home");
        } else if (data.user.role === "staff") {
          this.props.navigate("/system/staff-manage");
        }
      }
    } catch (error) {
      // console.log(error);
      console.log("Login failed:", error.response);
      this.setState({
        errMessage: error.response.data.message,
      });
    }
  };

  handleShowPassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };
  render() {
    // hàm render chỉ render 1 khối
    return (
      <div className="login-background1">
        <div className="login-container1">
          <div className="login-content1 row">
            <div className="col-12 text-login1">Đăng nhập</div>
            <div className="col-12 form-group login-input1">
              {/* <label>Tên đăng nhập</label> */}
              <input
                type="text"
                className="form-control"
                placeholder="Tên đăng nhập"
                // gia tri của this.state.username sẽ hiện ở trên Username của web
                value={this.state.username}
                onChange={(event) => this.handleOnChaneUsername(event)}
              />
            </div>
            <div className="col-12 form-group login-input1">
              {/* <label>Password</label> */}
              <div className="custom-input-password1">
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu"
                  onChange={(event) => this.handleOnChanePassword(event)}
                ></input>
                <span onClick={() => this.handleShowPassword()}>
                  <i
                    className={
                      this.state.isShowPassword
                        ? "far fa-eye"
                        : "far fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{ color: "red" }}>
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button
                className="btn-login1"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Login
              </button>
            </div>

            <a href='/forgot-password' className="forgot-password1">Quên mật khẩu?</a>

            <div style = {{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <span className="register1">Chưa có tài khoản?</span>
              <a href='/register'> Đăng ký</a>
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
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
