import React from "react";
import Modal from "../Modal";
import SignUpModal from "./SignUpModal";
import firebase from "../../firebase";
import history from "../../history";
import { connect } from "react-redux";
import { signIn } from "../../actions";
import "../../css/Origin.css";

// implement password reset
class Origin extends React.Component {
  state = {
    modalOpen: false,
    email: "",
    password: "",
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push("/home");
      }
    });
  }

  handleSignUpClick = () => {
    this.setState({ modalOpen: true });
  };

  handleClickOut = () => {
    this.setState({ modalOpen: false });
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn({
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    return (
      <div className="login-container">
        <form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
          <h2 className="login-header">Login</h2>
          <div className="input-fields">
            <div className="email-field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input
                  onChange={(e) => this.handleEmailChange(e)}
                  value={this.state.email}
                  type="text"
                  placeholder="Email"
                />
              </div>
            </div>
            {this.props.errorField === "email" ? (
              <div className="ui negative message">
                <p>{this.props.errorMessage}</p>
              </div>
            ) : (
              ""
            )}
            <div className="password-field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input
                  onChange={(e) => this.handlePasswordChange(e)}
                  value={this.state.password}
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
            {this.props.errorField === "password" ? (
              <div className="ui negative message">
                <p>{this.props.errorMessage}</p>
              </div>
            ) : (
              ""
            )}
            <button type="submit" className="login-button">
              Login
            </button>
            <button
              type="button"
              onClick={() => this.handleSignUpClick()}
              className="sign-up-button"
            >
              Sign Up
            </button>
            {this.state.modalOpen ? (
              <Modal>
                <SignUpModal
                  modalOpen={this.state.modalOpen}
                  handleClickOut={this.handleClickOut}
                />
              </Modal>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.authResult,
    errorField: state.auth.errorField,
  };
};

export default connect(mapStateToProps, { signIn })(Origin);
