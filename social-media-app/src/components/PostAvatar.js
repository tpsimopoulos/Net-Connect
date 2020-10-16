import React, { Component } from "react";
import "../css/PostAvatar.css";
export default class PostAvatar extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="post-avatar-pic">
          <img
            id="post-avatar"
            src={require("../img/avatar.png")}
            alt="post avatar picture"
            className="ui avatar image"
          />
        </div>
      </React.Fragment>
    );
  }
}
