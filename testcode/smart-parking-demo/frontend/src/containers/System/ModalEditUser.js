import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./UserManage.scss";
import _ from 'lodash'; // Thư viện lodash giúp xử lý mảng và object dễ dàng hơn

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
            id: '',
            account: '',
            password: '',
            fullName: '',
            roleId: '',
            cccd: '',
            address: '',
            phoneNumber: '',
            gender: '',
            numberPlate: ''
        };

    }

    componentDidMount() {
        // console.log('didmount modal edit user', this.props.currentUser);

        let user = this.props.currentUser; // Lấy thông tin user từ props
        console.log('check user', user);
        if (user && !_.isEmpty(user)) { // Kiểm tra xem user có tồn tại và không rỗng{}
            this.setState({
                id: user.id,
                account: user.account,
                password: 'password', // Không cho phép sửa password
                fullName: user.fullName,
                roleId: user.roleId,
                cccd: user.cccd,
                address: user.address,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                numberPlate: user.numberPlate
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent(); // Gọi hàm toggleFromParent được truyền từ component cha
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleOnChangeSelect = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }


    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['account', 'password', 'fullName', 'cccd', 'address', 'phoneNumber', 'phoneNumber', 'roleId', 'gender']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]){
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;;
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.editUser(this.state); // Gọi hàm createNewUser được truyền từ component cha và truyền state đến component cha
        }
    }
    render() {
        // console.log('check props from parent', this.props);
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }} className={'modal-user-container'}
                size="lg" // Kích thước của modal
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}> Edit a new user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Account</label>
                            <input disabled type="text" value={this.state.account} onChange={(event)=> {this.handleOnChangeInput(event, 'account')}}/>
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input disabled type="password" value={this.state.password} onChange={(event)=> {this.handleOnChangeInput(event, 'password')}}/>
                        </div>
                        <div className="input-container">
                            <label>Full Name</label>
                            <input type="text" value={this.state.fullName} onChange={(event)=> {this.handleOnChangeInput(event, 'fullName')}}/>
                        </div>
                        <div className="input-container">
                            <label>Personal ID</label>
                            <input type="text" value={this.state.cccd} onChange={(event)=> {this.handleOnChangeInput(event, 'cccd')}}/>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input type="text" value={this.state.address} onChange={(event)=> {this.handleOnChangeInput(event, 'address')}}/>
                        </div>
                        <div className="input-container">
                            <label>Number Plate</label>
                            <input type="text" value={this.state.numberPlate} onChange={(event)=> {this.handleOnChangeInput(event, 'numberPlate')}}/>
                        </div>
                        <div className="input-container">
                            <label>Phone Number</label>
                            <input type="text" value={this.state.phoneNumber} onChange={(event)=> {this.handleOnChangeInput(event, 'phoneNumber')}}/>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="genderSelect" className="form-label">Gender</label>
                            <select name="gender" id="genderSelect" className="form-control" onChange={(event)=> {this.handleOnChangeSelect(event, 'gender')}} value = {this.state.gender}>
                                <option value="">Choose...</option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                            </select>
                        </div>

                        <div className="form-group col-md-3">
                            <label htmlFor="roleSelect" className="form-label">Role</label>
                            <select name="roleId" id="roleSelect" className="form-control" onChange={(event)=> {this.handleOnChangeSelect(event, 'roleId')}} value = {this.state.roleId}>
                                <option value="">Choose...</option>
                                <option value="1">Admin</option>
                                <option value="2">Client</option>
                            </select>
                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" 
                    className='px-3' 
                    onClick={() => { this.handleSaveUser() }}>Save changes</Button>{' '}
                    <Button color="secondary" 
                    className='px-3' 
                    onClick={() => { this.toggle() }}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
