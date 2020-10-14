import React from "react";
import Modal from "./Modal";
import fire from "../fire";
import history from "../history";
import "../css/Origin.css";
// implement password reset
class Origin extends React.Component {
  state = {
    clicked: false,
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  };

  componentDidMount() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push("/home");
      }
    });
  }

  handleSignUpClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  signUpState = (bool) => {
    this.setState({ clicked: bool });
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  clearEmailError = () => this.setState({ emailError: "" });

  clearPasswordError = () => this.setState({ passwordError: "" });

  handleSubmit = (e) => {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((err) => {
        this.clearEmailError();
        this.clearPasswordError();
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            this.setState({ emailError: err.message });
            break;
          case "auth/wrong-password":
            this.setState({ passwordError: err.message });
            break;
        }
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
            {this.state.emailError ? (
              <div className="ui negative message">
                <p>{this.state.emailError}</p>
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
            {this.state.passwordError ? (
              <div className="ui negative message">
                <p>{this.state.passwordError}</p>
              </div>
            ) : (
              ""
            )}
            <button type="submit" className="login-button">
              Login
            </button>
            <button
              onClick={() => this.handleSignUpClick()}
              id="invertedSignUp"
              className="sign-up-button"
            >
              Sign Up
            </button>
            {this.state.clicked ? <Modal onDismiss={this.signUpState} /> : ""}
          </div>
        </form>
      </div>
    );
  }
}

export default Origin;
