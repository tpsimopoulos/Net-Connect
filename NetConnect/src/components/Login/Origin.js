import React from "react";
import Modal from "../Modal";
import SignUpModal from "./SignUpModal";
import PasswordResetModal from "./PasswordResetModal";
import InputField from "./InputField";
import history from "../../utilities/history";
import { connect } from "react-redux";
import { signIn, passwordReset } from "../../actions";
import "../../css/Origin.css";

// implement password reset
class Origin extends React.Component {
  state = {
    signUpModalOpen: false,
    email: "",
    password: "",
    passwordResetModalOpen: false,
  };

  handleSignUpClick = () => {
    this.setState({ signUpModalOpen: true });
  };

  handleClickOut = () => {
    this.setState({ signUpModalOpen: false });
    this.setState({ passwordResetModalOpen: false });
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleForgotPasswordClick = () => {
    this.setState({ passwordResetModalOpen: true });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn({
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    setTimeout(() => {
      if (!this.props.profile.isEmpty) {
        history.push("/home");
      }
    }, 500);
    return (
      <div className="login-page">
        <form
          onSubmit={(e) => this.handleSubmit(e)}
          className="login-page__form"
        >
          <h2 className="login-page__header login-page__header--color">
            Login
          </h2>
          <div className="login-page__inputFields">
            <InputField
              placeholder="Email"
              icon="user icon"
              stateValue={this.state.email}
              handleChange={(e) => this.handleEmailChange(e)}
              inputClassName="login-page__emailInput"
            />
            {this.props.errorField === "email" ? (
              <div className="login-page__emailInput--error">
                {this.props.errorMessage}
              </div>
            ) : (
              ""
            )}
            <InputField
              type="password"
              placeholder="Password"
              icon="lock icon"
              stateValue={this.state.password}
              handleChange={(e) => this.handlePasswordChange(e)}
              inputClassName="login-page__passwordInput"
            />
            {this.props.errorField === "password" ? (
              <div className="login-page__passwordInput--error">
                {this.props.errorMessage}
              </div>
            ) : (
              ""
            )}
            <a
              onClick={() => this.handleForgotPasswordClick()}
              className="login-page__forgotPassword"
            >
              Forgot your password?
            </a>
            {this.state.passwordResetModalOpen ? (
              <Modal>
                <PasswordResetModal
                  modalOpen={this.state.passwordResetModalOpen}
                  handleClickOut={this.handleClickOut}
                />
              </Modal>
            ) : (
              ""
            )}
            <button type="submit" className="login-page__loginButton">
              Login
            </button>
            <button
              type="button"
              onClick={() => this.handleSignUpClick()}
              className="login-page__signUpButton"
            >
              Sign Up
            </button>
            {this.state.signUpModalOpen ? (
              <Modal>
                <SignUpModal
                  modalOpen={this.state.signUpModalOpen}
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
    profile: state.firebase.profile,
    errorMessage: state.auth.authResult,
    errorField: state.auth.loginErrorField,
  };
};

export default connect(mapStateToProps, { signIn })(Origin);
