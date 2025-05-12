import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import ParkingStatus from "./Section/ParkingStatus";
class HomePage extends Component {
  render() {

    return (
        <div> 
            <HomeHeader />
            {/* <div className="home-page-container"> */}
                {/* <div className="home-page-content"> */}
                    {/* <div className="home-page-section"> */}
            <ParkingStatus />
                    {/* </div> */}
                {/* </div> */}
            {/* </div> */}
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
