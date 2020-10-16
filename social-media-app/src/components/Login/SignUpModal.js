import React from "react";
import ReactDOM from "react-dom";
import history from "../../history";
import "../../css/Modal.css";
import fire from "../../fire";
// Need to add form validation

class SignUpModal extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
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
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch((err) => {
        this.clearErrorMessage();
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
          case "auth/weak-password":
            this.setState({ errorMessage: err.message });
            break;
        }
      });

    if (fire.auth().currentUser) {
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
            <div>
              <div className="email-field">
                <div className="ui input">
                  <input
                    className="email-input"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(e) => this.handleEmailChange(e)}
                  ></input>
                </div>
              </div>
            </div>
            <div>
              <div className="password-field">
                <div className="ui input">
                  <input
                    id="password-input"
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={(e) => this.handlePasswordChange(e)}
                  ></input>
                </div>
              </div>

              {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : ""}
            </div>
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

export default SignUpModal;
