import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux.js";
import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication.js";

import { path } from "../utils/index.js";

import Home from "../routes/Home.js";
import Login from "./Auth/Login.js";
// import Header from "./Header/Header.js";
import System from "../routes/System.js";

import { CustomToastCloseButton } from "../components/CustomToast.js";
import HomePage from "./HomePage/HomePage.js";
import Register from "./Auth/Register.js";

class App extends Component {
  // handlePersistorState = () => {
  //   const { persistor } = this.props;
  //   let { bootstrapped } = persistor.getState();
  //   if (bootstrapped) {
  //     if (this.props.onBeforeLift) {
  //       Promise.resolve(this.props.onBeforeLift())
  //         .then(() => this.setState({ bootstrapped: true }))
  //         .catch(() => this.setState({ bootstrapped: true }));
  //     } else {
  //       this.setState({ bootstrapped: true });
  //     }
  //   }
  // };

  componentDidMount() {
    // this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        {/* History là để Cache dữ liệu từ phía server để đỡ phải gọi lại */}
        <Router history={history}>
          <div className="main-container">
            {/* Nếu đăng nhập rôi thì render thêm Header */}
            <span className="content-container">
              <Switch>
              {/* // Vào Home thì không cần phải đăng nhập */}
                <Route path={path.HOME} exact component={Home} /> 
                <Route
                  path={path.LOGIN}
                  component={userIsNotAuthenticated(Login)}
                />
                <Route path={path.REGISTER} component={Register} />
                <Route
                  path={path.SYSTEM}
                  component={userIsAuthenticated(System)}
                />
                <Route path={path.HOMEPAGE} component={HomePage} />
              </Switch>
            </span>

            <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
