import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions/index.js";
import "./Register.scss";
import { handleLoginApi } from "../../services/userService.js";
import { createNewUserService } from "../../services/userService.js";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
            account: "",
            password: "",
            repeatPassword: "",
            fullName: "",
            pId: "",
            role: "user",
            address: "",
            phoneNumber: "",
            gender: "",
            cars: {
                numberPlate: "",
            },
            isShowPassword: false,
            errMessage: "",
        };
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        if (id === 'numberPlate') {
            copyState.cars.numberPlate = event.target.value;
            this.setState({
                ...copyState
            });
        }
        else {
            copyState[id] = event.target.value;
            this.setState({
                ...copyState
            });
        }
    }
    handleOnChangeSelect = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['account', 'password', 'repeatPassword','fullName', 'pId', 'address', 'phoneNumber', 'gender']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        if (this.state.cars.numberPlate === '') {
            isValid = false;
            alert('Missing parameter: number plate');
        }
        if (this.state.password !== this.state.repeatPassword) {
            isValid = false;
            alert('Password not match');
        }
        return isValid;;
    }
    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };
    handleAddNewUser = async (data) => {
        let isValid = this.checkValidateInput();
        if (isValid === true){
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                this.setState({
                    errMessage: "",
                });
                // this.props.userLoginSuccess(res.user);
                alert("Tạo tài khoản thành công");
            } else {
                this.setState({
                    errMessage: res.message,
                });
            }

        }
    };
    
    render() {
        // hàm render chỉ render 1 khối
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 text-login">Đăng Ký</div>
                        <div className="col-12 form-group login-input">
                            <label>Tên đăng nhập</label>
                            <input
                                type="text"
                                className="form-control"
                                // placeholder="Tên đăng nhập"
                                // gia tri của this.state.username sẽ hiện ở trên Username của web
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "account")}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    //   placeholder="Mật khẩu"
                                    onChange={(event) => this.handleOnChangeInput(event, "password")}
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

                        <div className="col-12 form-group login-input">
                            <label>Nhập lại mật khẩu</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    //   placeholder="Mật khẩu"
                                    onChange={(event) => this.handleOnChangeInput(event, "repeatPassword")}
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
                        {/* Họ và tên */}
                        <div className="col-12 form-group login-input">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "fullName")}
                            />
                        </div>
                        {/* Số CCCD */}
                        <div className="col-12 form-group login-input">
                            <label>Số CCCD</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "pId")}
                            />
                        </div>
                        {/* Biển số xe */}
                        <div className="col-12 form-group login-input">
                            <label>Biển số xe</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "numberPlate")}
                            />
                        </div>
                        {/* Số điện thoại */}
                        <div className="col-12 form-group login-input">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "phoneNumber")}
                            />
                        </div>
                        {/* Địa chỉ */}
                        <div className="col-12 form-group login-input">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, "address")}
                            />
                        </div>

                        {/* Giới tính */}
                        <div className="col-12 form-group login-input">
                            <label>Giới tính</label>
                            <select className="form-control" onChange={(event) => this.handleOnChangeSelect(event,"gender")}>
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        </div>


                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={() => {
                                    this.handleAddNewUser(this.state);
                                }}
                            >
                                Đăng ký
                            </button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                            <span className="register">Đã có tài khoản?</span>
                            <a href='/login'> Đăng nhập</a>
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
