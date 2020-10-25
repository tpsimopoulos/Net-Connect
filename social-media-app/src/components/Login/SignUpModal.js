import React from "react";
import ReactDOM from "react-dom";
import history from "../../history";
import InputField from "./InputField";
import { signUp } from "../../actions";
import "../../css/Modal.css";
import { connect } from "react-redux";
// Need to add form validation

class SignUpModal extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value });
  };

  handleLastNameChange = (e) => {
    this.setState({ lastName: e.target.value });
  };

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signUp(this.state);
  };

  render() {
    setTimeout(() => {
      if (!this.props.profile.isEmpty) {
        history.push("/home");
      }
    }, 500);
    return (
      <div
        style={{ display: this.props.modalOpen ? "block" : "none" }}
        className="modal"
        onClick={() => {
          this.props.handleClickOut();
        }}
      >
        <div className="modal__content-container">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal__content modal__content--background"
          >
            <h2 className="modal__signUp">Signup</h2>
            <form
              className="modal__form"
              onSubmit={(e) => this.handleSubmit(e)}
            >
              <InputField
                placeholder="First Name"
                stateValue={this.state.firstName}
                handleChange={(e) => this.handleFirstNameChange(e)}
              />
              <InputField
                placeholder="Last Name"
                stateValue={this.state.lastName}
                handleChange={(e) => this.handleLastNameChange(e)}
              />
              <InputField
                placeholder="Username"
                stateValue={this.state.username}
                handleChange={(e) => this.handleUsernameChange(e)}
              />
              <InputField
                placeholder="Email"
                stateValue={this.state.email}
                handleChange={(e) => this.handleEmailChange(e)}
                errorClass={
                  this.props.errorField === "email"
                    ? "modal__form-email-error"
                    : ""
                }
              />
              {this.props.errorField === "email" ? (
                <div className="modal__form-error">
                  {this.props.errorMessage}
                </div>
              ) : (
                ""
              )}
              <InputField
                type="password"
                placeholder="Password"
                stateValue={this.state.password}
                handleChange={(e) => this.handlePasswordChange(e)}
                errorClass={
                  this.props.errorField === "password"
                    ? "modal__form-password-error"
                    : ""
                }
              />
              {this.props.errorField === "password" ? (
                <div className="modal__form-error">
                  {this.props.errorMessage}
                </div>
              ) : (
                ""
              )}
              <button
                id="submit-button"
                className="create-acct-button"
                type="submit"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.firebase.profile,
    errorMessage: state.auth.signUpResult,
    errorField: state.auth.signUpErrorField,
  };
};
export default connect(mapStateToProps, { signUp })(SignUpModal);
