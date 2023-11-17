import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../utilities/firebase";

export default class NavbarComponent extends Component {
  handleClick = (name) => {
    if (name === "Logout") {
      firebase.auth().signOut();
      sessionStorage.removeItem("user_id");
    }
  };

  render() {
    const { name, className } = this.props;
    return (
      <Link
        to={name === "Logout" ? "/" : `/${name.toLowerCase()}`}
        className={className}
        onClick={() => this.handleClick(name)}
      >
        {name}
      </Link>
    );
  }
}
