import React, { Component } from "react";

export default class NavbarComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <a className="item" onClick={() => this.props.onClick(this.props.name)}>
          {this.props.name}
        </a>
      </React.Fragment>
    );
  }
}
