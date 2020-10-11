import React from "react";
import Modal from "./Modal";
import "../css/Origin.css";
import fire from "../fire";
import history from "../history";

class Origin extends React.Component {
  state = {
    clicked: false,
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  };

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

  clearErrors = () => {
    this.setState({ emailError: "" });
    this.setState({ passwordError: "" });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            this.setState({ emailError: err.message });
            break;
          case "auth/wrong-password":
            this.setState({ passwordError: err.message });
            break;
          case "":
            this.clearErrors();
            break;
          default:
            console.log("Unrecognized Error");
        }
      });
    history.push("/home");
  };

  render() {
    return (
      <React.Fragment>
        <div className="ui middle aligned center aligned grid">
          <div id="loginScreen" className="column">
            <h2 className="ui blue image header">
              <div className="content">Log-in to your account</div>
            </h2>
            <form
              onSubmit={(e) => this.handleSubmit(e)}
              className="ui large form"
            >
              <div className="ui stacked segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      onChange={(e) => this.handleEmailChange(e)}
                      value={this.state.email}
                      type="text"
                      placeholder="Email"
                    />
                  </div>
                  {this.state.emailError ? (
                    <div className="ui negative message">
                      <p>{this.state.emailError}</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="field">
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
                <button
                  type="submit"
                  className="ui fluid large blue submit button"
                >
                  Login
                </button>
                <div
                  onClick={() => this.handleSignUpClick()}
                  id="invertedSignUp"
                  className="ui fluid large inverted submit button"
                >
                  Sign Up
                </div>
                {this.state.clicked ? (
                  <Modal onDismiss={this.signUpState} />
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Origin;
