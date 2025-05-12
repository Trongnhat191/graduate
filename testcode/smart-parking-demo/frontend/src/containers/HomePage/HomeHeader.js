import React, { Component } from "react";
import { connect } from "react-redux";
import './HomeHeader.scss';


class HomeHeader extends Component {
  render() {
    // console.log("check user info", this.props.userInfo);
    return (

        <div className="home-header-container"> 
            <div className="home-header-content">
              <div className="left-content">

              </div>
              <div className="center-content">

              </div>
              <div className="right-content">

              </div >
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    // userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
