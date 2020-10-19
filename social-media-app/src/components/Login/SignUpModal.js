import React from "react";
import ReactDOM from "react-dom";
import history from "../../history";
import firebase from "../../firebase";
import InputField from "./InputField";
import { signUp } from "../../actions";
import "../../css/Modal.css";
import { connect } from "react-redux";
import { Input } from "semantic-ui-react";
// Need to add form validation

class SignUpModal extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value });
  };

  handleLastNameChange = (e) => {
    this.setState({ lastName: e.target.value });
  };
  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  clearErrorMessage = () => this.setState({ errorMessage: "" });

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.signUp(this.state);
    if (firebase.auth().currentUser) {
      history.push("/home");
    }
  };

  render() {
    return (
      <div
        style={{ display: this.props.modalOpen ? "block" : "none" }}
        className="modal-container"
        onClick={() => this.props.handleClickOut()}
      >
        <div onClick={(e) => e.stopPropagation()} className="modal-content">
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <InputField
              fieldName="firstName"
              placeholder="First Name"
              stateValue={this.state.firstName}
              handleChange={(e) => this.handleFirstNameChange(e)}
            />
            <InputField
              fieldName="lastName"
              placeholder="Last Name"
              stateValue={this.state.lastName}
              handleChange={(e) => this.handleLastNameChange(e)}
            />
            <InputField
              fieldName="email"
              placeholder="Email"
              stateValue={this.state.email}
              handleChange={(e) => this.handleEmailChange(e)}
            />
            <InputField
              type="password"
              fieldName="password"
              placeholder="Password"
              stateValue={this.state.password}
              handleChange={(e) => this.handlePasswordChange(e)}
            />
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
    );
  }
}

export default connect(null, { signUp })(SignUpModal);
