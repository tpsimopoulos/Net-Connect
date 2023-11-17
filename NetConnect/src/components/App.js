import React from "react";
import { Router, Route, Redirect } from "react-router-dom";
import history from "../utilities/history";
import firebase from "../utilities/firebase";
import Home from "./Home/Home";
import Origin from "./Login/Origin";
import Profile from "./Profile/Profile";
import PostDetail from "./PostDetail";
import Navbar from "./Navbar/Navbar";
import { compose } from "redux";
import { connect } from "react-redux";
import "../css/App.css";

class App extends React.Component {
  // originally used componentDidMount to set session storage but since it's invoked after
  // first render the uid is still undefined.
  componentDidUpdate() {
    const { userLoggedIn } = this.props;
    sessionStorage.setItem("user_id", userLoggedIn);
  }

  render() {
    const userActive = sessionStorage.getItem("user_id");
    return (
      <div>
        <Router history={history}>
          {userActive ? <Navbar /> : null}
          <div>
            <Route path="/" exact component={Origin} />
            {userActive ? (
              <>
                <Route path="/home" exact component={Home} />
                <Route path="/profile" exact component={Profile} />
                <Route path="/post/:post_id" exact component={PostDetail} />
              </>
            ) : (
              history.push("/")
            )}
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userLoggedIn: state.firebase.auth.uid,
  };
};

export default compose(connect(mapStateToProps))(App);
