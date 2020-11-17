import React from "react";
import firebase from "../../utilities/firebase";
import history from "../../utilities/history";
import { Link } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import "../../css/Navbar.css";

class Navbar extends React.Component {
  state = {
    responsiveDropdownClicked: false,
  };

  handleResponsiveDropdownClick = () => {
    this.setState({
      responsiveDropdownClicked: !this.state.responsiveDropdownClicked,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="navbar">
          <div
            className="logo-container"
            onClick={() => this.handleClick("home")}
          >
            <img
              src={require("../../img/logo.png")}
              alt="website logo"
              className="logo"
            />
          </div>

          <ul className="navbar__menu">
            {["Home", "Profile", "Logout"].map((page) => {
              return (
                <NavbarComponent
                  key={page}
                  name={page}
                  className={"navbar__menu-item"}
                />
              );
            })}
            <div className="navbar-dropdown">
              <button className="navbar-dropdown__btn">
                <i
                  className="bars icon"
                  onClick={() => this.handleResponsiveDropdownClick()}
                />
              </button>
              <ul
                className={
                  this.state.responsiveDropdownClicked
                    ? "navbar-dropdown__content active"
                    : "navbar-dropdown__content"
                }
              >
                {["Home", "Profile", "Logout"].map((page) => {
                  return (
                    <NavbarComponent
                      key={page}
                      name={page}
                      className={"navbar__menu-dropDownItem"}
                    />
                  );
                })}
              </ul>
            </div>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default Navbar;
