import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./UserManage.scss";


class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Chứa các biến muốn quản lý State
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

    componentDidMount() { }

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
    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser(this.state); // Gọi hàm createNewUser được truyền từ component cha và truyền state đến component cha
        }
    }
    render() {
        console.log('check props', this.props);
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }} className={'modal-user-container'}
                size="lg" // Kích thước của modal
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}> Create a new user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Account</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'account')}}/>
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input type="password" onChange={(event)=> {this.handleOnChangeInput(event, 'password')}}/>
                        </div>
                        <div className="input-container">
                            <label>Full Name</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'fullName')}}/>
                        </div>
                        <div className="input-container">
                            <label>Personal ID</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'cccd')}}/>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'address')}}/>
                        </div>
                        <div className="input-container">
                            <label>Number Plate</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'numberPlate')}}/>
                        </div>
                        <div className="input-container">
                            <label>Phone Number</label>
                            <input type="text" onChange={(event)=> {this.handleOnChangeInput(event, 'phoneNumber')}}/>
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
                    onClick={() => { this.handleAddNewUser() }}>Save changes</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
