import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers} from '../../services/userService';

class UserManage extends Component {

    // Khai báo các biến trong state
    //props la các biến được truyền từ cha xuống con
    //state la các biến được khai báo trong component
    constructor(props) {
        super(props);
        this.state = {
            //Chứa các biến muốn quản lý State
            
                arrUsers: []
            
        };
    }

    // Là 1 lifecycle method của react, được gọi sau khi component được render lần đầu tiên
    // Dùng để gọi API, set state, ...
    async componentDidMount() {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
     }

    render() {
        // console.log('check state', this.state);
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <div className='title text-center'>Manage users with me</div>

                <div className='users-table mt-3 mx-1'>
                    <h1>A Fancy Table</h1>

                    <table id="customers">
                        <tr>
                            <th>Account</th>
                            <th>Fullname</th>
                            <th>Personal ID</th>
                            <th>Number Plate</th>
                            <th>Actions</th>
                        </tr>
                        {arrUsers && arrUsers.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.account}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.cccd}</td>
                                    <td>{item.numberPlate}</td>
                                    <td>
                                        <button className='btn-edit'><i className = "fas fa-pencil-alt"></i></button>
                                        <button className='btn-delete'><i className= "fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        })
                        }
                        
                        
                    </table>

                </div>
            </div>
                );
    }

}

const mapStateToProps = state => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return { };
};

                export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
