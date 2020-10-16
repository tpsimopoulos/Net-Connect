import React, { Component } from "react";
import "../../css/Profile.css";

export default class ProfileAvatar extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="profile-pic-avatar">
          <img
            id="profile-avatar"
            src={require("../../img/avatar.png")}
            alt="profile picture"
            className="ui avatar image"
          />
        </div>
      </React.Fragment>
    );
  }
}
