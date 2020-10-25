import React, { Component } from "react";
export default class InputField extends Component {
  render() {
    const {
      type,
      errorClass,
      placeholder,
      stateValue,
      handleChange,
    } = this.props;
    return (
      <input
        className={errorClass ? errorClass : ""}
        type={type ? "password" : "text"}
        placeholder={placeholder}
        value={stateValue}
        onChange={handleChange}
      ></input>
    );
  }
}
