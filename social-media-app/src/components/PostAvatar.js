import React, { Component } from "react";
export default class PostAvatar extends Component {
  render() {
    return (
      <React.Fragment>
        <img
          src={require("../img/avatar.png")}
          alt="post avatar picture"
          className="post-avatar"
        />
      </React.Fragment>
    );
  }
}
