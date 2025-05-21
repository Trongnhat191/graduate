import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./UserManage.scss";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
            account: "",
            password: "",
            fullName: "",
            role: "",
            pId: "",
            address: "",
            phoneNumber: "",
            gender: "",
            cars: {
                numberPlate: "",
            },
        };
    }

    componentDidMount() { }

    toggle = () => {
        this.props.toggleFromParent(); // Gọi hàm toggleFromParent được truyền từ component cha
    };

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
        let arrInput = ['account', 'password', 'fullName', 'pId', 'address', 'phoneNumber', 'role', 'gender']
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
        return isValid;;
    }
    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser(this.state); // Gọi hàm createNewUser được truyền từ component cha và truyền state đến component cha
        }
    };
    render() {
        // console.log("check props", this.props);
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-user-container"}
                size="lg" // Kích thước của modal
                centered
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    {" "}
                    Create a new user
                </ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Account</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "account");
                                }}
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input
                                type="password"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "password");
                                }}
                            />
                        </div>
                        <div className="input-container">
                            <label>Full Name</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "fullName");
                                }}
                            />
                        </div>
                        <div className="input-container">
                            <label>Personal ID</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "pId");
                                }}
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "address");
                                }}
                            />
                        </div>
                        <div className="input-container">
                            <label>Number Plate</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "numberPlate");
                                }}
                            />
                        </div>
                        <div className="input-container">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, "phoneNumber");
                                }}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="genderSelect" className="form-label">
                                Gender
                            </label>
                            <select
                                name="gender"
                                id="genderSelect"
                                className="form-control"
                                onChange={(event) => {
                                    this.handleOnChangeSelect(event, "gender");
                                }}
                                value={this.state.gender}
                            >
                                <option value="">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="form-group col-md-3">
                            <label htmlFor="roleSelect" className="form-label">
                                Role
                            </label>
                            <select
                                name="role"
                                id="roleSelect"
                                className="form-control"
                                onChange={(event) => {
                                    this.handleOnChangeSelect(event, "role");
                                }}
                                value={this.state.role}
                            >
                                <option value="">Choose...</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handleAddNewUser();
                        }}
                    >
                        Save changes
                    </Button>{" "}
                    <Button
                        color="secondary"
                        className="px-3"
                        onClick={() => {
                            this.toggle();
                        }}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
