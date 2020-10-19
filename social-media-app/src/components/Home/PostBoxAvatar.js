import React, { Component } from "react";

export default class PostBoxAvatar extends Component {
  render() {
    return (
      <React.Fragment>
        <img src={require("../../img/avatar.png")} alt="post avatar picture" />
      </React.Fragment>
    );
  }
}
