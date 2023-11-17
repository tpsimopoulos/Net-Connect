import React, { Component } from "react";
import InputField from "./InputField";
import { resetPassword } from "../../actions";
import "../../css/PasswordResetModal.css";
import { connect } from "react-redux";
class PasswordResetModal extends Component {
  state = {
    email: "",
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = () => {
    this.props.resetPassword(this.state.email);
    this.setState({ email: "" });
  };
  render() {
    return (
      <div
        style={{ display: this.props.modalOpen ? "block" : "none" }}
        className="passwordResetModal"
        onClick={() => {
          this.props.handleClickOut();
        }}
      >
        <div className="passwordResetModal__content">
          <div
            onClick={(e) => e.stopPropagation()}
            className="passwordResetModal__background passwordResetModal__background--backgroundColor"
          >
            <h2 className="passwordResetModal__title">Reset Password</h2>
            <div className="passwordResetModal__emailInput">
              <InputField
                placeholder="Email"
                stateValue={this.state.email}
                handleChange={(e) => this.handleEmailChange(e)}
                errorClass={
                  this.props.errorField === "email"
                    ? "passwordResetModal-email-error"
                    : ""
                }
              />
              {this.props.errorField === "email" ? (
                <div className="passwordResetModal-error">
                  {this.props.errorMessage}
                </div>
              ) : (
                ""
              )}
            </div>
            <button
              onClick={() => this.handleSubmit()}
              className="passwordResetModal__button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { resetPassword })(PasswordResetModal);
