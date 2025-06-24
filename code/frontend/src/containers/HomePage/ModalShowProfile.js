import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ModalShowProfile.scss'; // Import CSS file for styling
class ModalShowProfile extends Component {
  constructor(props) {
    super(props);
    // console.log('check props from modal', this.props); 
    this.state = {
      account: '',
      fullName: '',
      pId: '',
      address: '',
      phoneNumber: '',
      gender: '',
      "cars.numberPlate": ''
    }
  }


  componentDidMount() {
    const { userInfo } = this.props;
    // console.log('check userInfo from modal', userInfo);
    if (userInfo) {
      this.setState({
        account: userInfo.account || '',
        fullName: userInfo.fullName || '',
        pId: userInfo.pId || '',
        address: userInfo.address || '',
        phoneNumber: userInfo.phoneNumber || '',
        gender: userInfo.gender || '',
        "cars.numberPlate": userInfo['cars.numberPlate'] || '',
      });
    }
  }

  toggle = () => {
    this.props.onClose(); // Đóng modal khi nhấn outside hoặc gọi toggle
  };

  render() {
    // console.log("numberPlate from ModalShowProfile", this.props);
    // console.log("fullName from ModalShowProfile", this.props.userInfo.fullName || '');
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.toggle}>
        <ModalHeader >Thông tin cá nhân</ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Tài khoản</label>
              <input disabled type="text" value={this.state.account} />
            </div>
            <div className="input-container">
              <label>Họ và tên</label>
              <input disabled type="text" value={this.state.fullName} />
            </div>
            <div className="input-container">
              <label>CMND/CCCD</label>
              <input disabled type="text" value={this.state.pId} />
            </div>
            <div className="input-container">
              <label>Địa chỉ</label>
              <input disabled type="text" value={this.state.address} />
            </div>
            <div className="input-container">
              <label>Biển số xe</label>
              <input disabled type="text" value={this.state["cars.numberPlate"]} />
            </div>
            <div className="input-container">
              <label>Số điện thoại</label>
              <input disabled type="text" value={this.state.phoneNumber} />
            </div>
            <div className="input-container">
              <label>Giới tính</label>
              <input disabled type="text" value={this.state.gender === 'male' ? 'Nam' : this.state.gender === 'female' ? 'Nữ' : ''} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={this.toggle}>
            Đóng
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(ModalShowProfile);
