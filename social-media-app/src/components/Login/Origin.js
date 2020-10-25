import React from "react";
import Modal from "../Modal";
import SignUpModal from "./SignUpModal";
import InputField from "./InputField";
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

  componentDidMount() {}

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
          <div className="login_page__input-fields">
            <InputField
              placeholder="Email"
              icon="user icon"
              stateValue={this.state.email}
              handleChange={(e) => this.handleEmailChange(e)}
            />
            {this.props.errorField === "password" ? (
              <div className="modal__form-error">{this.props.errorMessage}</div>
            ) : (
              ""
            )}
            <InputField
              type="password"
              placeholder="Password"
              icon="lock icon"
              stateValue={this.state.password}
              handleChange={(e) => this.handlePasswordChange(e)}
            />
            {this.props.errorField === "password" ? (
              <div className="modal__form-error">{this.props.errorMessage}</div>
            ) : (
              ""
            )}
            <button type="submit" className="login_page__login-button">
              Login
            </button>
            <button
              type="button"
              onClick={() => this.handleSignUpClick()}
              className="login_page__sign-up-button"
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
    profile: state.firebase.profile,
    errorMessage: state.auth.authResult,
    errorField: state.auth.loginErrorField,
  };
};

export default connect(mapStateToProps, { signIn })(Origin);
