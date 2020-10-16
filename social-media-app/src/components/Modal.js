import React from "react";
import ReactDOM from "react-dom";
import "../css/Modal.css";
// Need to add form validation
var modalRoot = document.getElementById("modal-root");

class Modal extends React.Component {
  constructor() {
    super();
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default Modal;
