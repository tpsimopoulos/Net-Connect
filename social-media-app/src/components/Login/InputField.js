import React, { Component } from "react";

export default class InputField extends Component {
  render() {
    const {
      type,
      fieldName,
      placeholder,
      stateValue,
      handleChange,
    } = this.props;
    return (
      <div
        className={
          this.props.inputClassName ? this.props.inputClassName : "ui input"
        }
      >
        <i className={this.props.icon} />
        <input
          type={type ? "password" : ""}
          className={`${fieldName}-input`}
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
        />
      </div>
    );
  }
}
