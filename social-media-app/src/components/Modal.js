import React from "react";
import ReactDOM from "react-dom";
import history from "../history";
import "../css/Modal.css";
import fire from "../fire";
// Need to add form validation

class Modal extends React.Component {
  state = {
    clickOut: true,
    email: "",
    password: "",
    errorMessage: "",
  };

  componentDidMount() {
    fire.auth().onAuthStateChanged((firebaseUser) => {
      // add something meaningful in here
    });
  }

  handleOutClick = () => {
    this.setState({ clickOut: !this.state.clickOut });
    this.props.onDismiss(false);
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
    return ReactDOM.createPortal(
      <div
        onClick={() => this.handleOutClick()}
        className={`ui dimmer ${this.state.clickOut ? "active" : ""}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="ui basic modal active"
        >
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div>
              <label>
                <h3>Email</h3>
              </label>
              <input
                id="email_input"
                placeholder="Email"
                value={this.state.email}
                onChange={(e) => this.handleEmailChange(e)}
              ></input>
            </div>
            <div>
              <label>
                <h3>Password</h3>
              </label>
              <input
                id="password_input"
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={(e) => this.handlePasswordChange(e)}
              ></input>
              {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : ""}
            </div>
            <button id="submit-button" className="ui button" type="submit">
              Create Account
            </button>
          </form>
        </div>
      </div>,
      document.querySelector("#modal")
    );
  }
}

export default Modal;
