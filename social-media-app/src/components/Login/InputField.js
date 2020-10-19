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
      <div>
        <div className={`${this.props.fieldName}-field`}>
          <div className="ui input">
            <input
              type={type ? "password" : ""}
              className={`${fieldName}-input`}
              placeholder={placeholder}
              value={stateValue}
              onChange={handleChange}
            ></input>
          </div>
        </div>
      </div>
    );
  }
}
