import React, { Component } from "react";
import "../../css/ProfileAvatar.css";

export default class ProfileAvatar extends Component {
  render() {
    return (
      <React.Fragment>
        <img
          src={require("../../img/avatar.png")}
          alt="profile picture"
          className="profile-avatar"
        />
      </React.Fragment>
    );
  }
}
