import React, { Component } from "react";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsersAndNumberPlate, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser
 from "./ModalEditUser";
class UserManage extends Component {
    // Khai báo các biến trong state
    //props la các biến được truyền từ cha xuống con
    //state la các biến được khai báo trong component
    constructor(props) {
        super(props);
        this.state = {
            //Chứa các biến muốn quản lý State

            arrUsers: [],
            isOpenModalUser: false, // Mặc định là ko mở modal
            isOpenModalEditUser: false, // Mặc định là ko mở modal
            userEdit : {},
        };
    }

    // Là 1 lifecycle method của react, được gọi sau khi component được render lần đầu tiên
    // Dùng để gọi API, set state, ...
    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsersAndNumberPlate("ALL");
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users,
            });
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true, // Mở modal
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser, // Đóng modal
        });
    };

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser, // Đóng modal
        });
    }

    createNewUser = async (data) => {
        try {
            console.log("check data from ModelEditUser", data);
            let rensponse = await createNewUserService(data);
            if (rensponse && rensponse.errCode !== 0) {
                alert(rensponse.message);
            }
            else {
                await this.getAllUsersFromReact(); // Gọi lại API để lấy danh sách user mới
                this.setState({
                    isOpenModalUser: false, // Đóng modal
                });
            }
        } catch (error) {
            
        }
        console.log("check create new user", data);
    }

    handleDeleteUser = async (user) => {
        console.log("check delete user", user);
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                this.getAllUsersFromReact();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    handleEditUser = (user) => {
        // console.log("user from handleEditUser", user);
        this.setState({
            isOpenModalEditUser: true, // Mở modal
            editUser: user, // Truyền user hiện tại vào modal
        });

    }

    doEditUser = async (user) => {
        console.log("check edit user", user);
        let res = await editUserService(user);
        if (res && res.errCode === 0) {
            this.setState({
                isOpenModalEditUser: false, // Đóng modal
            });
            await this.getAllUsersFromReact(); // Gọi lại API để lấy danh sách user mới
        } else {
            alert(res.message);
        }
    }

    render() {
        // console.log('check state', this.state);
        let arrUsers = this.state.arrUsers;
        // console.log('check arrUsers', arrUsers);
        return (
            <div className="users-container">
                <ModalUser
                    // Danh sách các props truyền vào ModalUser từ UserManage
                    isOpen={this.state.isOpenModalUser} // Để mở và đóng modal, nó sẽ được truyền vào ModalUser (Là 1 component con)
                    toggleFromParent={this.toggleUserModal} // Để mở và đóng modal
                    // toggle={() => this.setState({ isOpenModalUser: !this.state.isOpenModalUser })} // Để mở và đóng modal
                    createNewUser={this.createNewUser} // Để tạo mới user
                />

                {/* thêm điều kiện để trong componentDidMount của ModelEditUser có thể lấy được currentUser */}
                {this.state.isOpenModalEditUser && 
                <ModalEditUser
                    isOpen={this.state.isOpenModalEditUser} // Để mở và đóng modal
                    toggleFromParent={this.toggleEditUserModal} // Để mở và đóng modal
                    currentUser={this.state.editUser} // Để truyền user hiện tại vào modal
                    editUser={this.doEditUser} // Để sửa user
                />
                }
                {/* --------------Title--------------- */}
                <div className="title text-center">Manage users with me</div>
                {/* ---------------------------------- */}

                {/* --------------Button Add new user--------------- */}
                <div className="mx-1">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i>Add a new user
                    </button>
                </div>
                {/* ---------------------------------- */}

                {/* --------------Table--------------- */}
                <div className="users-table mt-3 mx-1">
                    <h1></h1>

                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Account</th>
                                <th>Fullname</th>
                                <th>Personal ID</th>
                                <th>Number Plate</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers &&
                                arrUsers.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.account}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.pId}</td>
                                            <td>{item.cars.numberPlate}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => this.handleEditUser(item)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className="btn-delete" onClick ={() => this.handleDeleteUser(item)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                {/* ---------------------------------- */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
