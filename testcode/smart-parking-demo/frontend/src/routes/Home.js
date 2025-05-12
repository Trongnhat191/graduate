import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Home extends Component {
  render() {
    // Nếu chưa đăng nhập thì sẽ chuyển hướng về trang login
    // Nếu đã đăng nhập thì sẽ chuyển hướng về trang user-manage
    const { isLoggedIn } = this.props;
    let linkToRedirect = isLoggedIn ? "/system/user-manage" : "/home";

    return <Redirect to={linkToRedirect} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
