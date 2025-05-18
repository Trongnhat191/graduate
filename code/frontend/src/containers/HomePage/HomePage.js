import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import ParkingStatus from "./Section/ParkingStatus";
import ModalShowProfile from "./ModalShowProfile";
import History from "./Section/History"

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  isShowProfileModal: false,
		  currentView: "P",
		};
	  }
	
	handleToggleProfileModal = () => {
		this.setState((prevState) => ({
		  isShowProfileModal: !prevState.isShowProfileModal,
		}));
	  }
	
	handleChangeView = (view) => {
		this.setState({ currentView: view });	
	}

	render() {
		// console.log("check userInfo from home page", this.props.userInfo);
		return (
			<div className="home-page-container">

				<ModalShowProfile 
				isOpen={this.state.isShowProfileModal}// Truyền props isOpen từ state
				userInfo={this.props.userInfo} // Truyền props userInfo từ Redux
				onClose={this.handleToggleProfileModal} // Truyền props onClose từ state
				/>

				<div className="home-page-header">
					{/* // Truyền hàm handleToggleProfileModal vào HomeHeader */}
					<HomeHeader 
					onShowProfile = {this.handleToggleProfileModal}
					onChangeView={this.handleChangeView}
					/> 
				</div>

				<div className="home-page-body">
					{this.state.currentView === "P" && <ParkingStatus/>}
					{this.state.currentView === "H" && <History/>}
				</div>
				
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
