import React, { Component } from "react";

export class ProfileMenuItem extends Component {
  render() {
    return (
      <React.Fragment>
        <a
          className={
            this.props.className === "active-item" ? "active-item" : "item"
          }
          onClick={() => this.props.onClick(this.props.id)}
        >
          {this.props.name}
        </a>
      </React.Fragment>
    );
  }
}

export default ProfileMenuItem;
