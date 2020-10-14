import React from "react";
import { Link } from "react-router-dom";
import fire from "../../fire";
import NavbarComponent from "./NavbarComponent";
import history from "../../history";
import "../../css/Navbar.css";

class Navbar extends React.Component {
  handleClick(page) {
    history.push(`/${page.toLowerCase()}`);
  }

  render() {
    return (
      <React.Fragment>
        <div id="Navbar" class="ui secondary menu">
          {["Home", "Profile"].map((page) => {
            return (
              <NavbarComponent
                key={page}
                name={page}
                onClick={this.handleClick}
              />
            );
          })}
          <Link
            onClick={() => fire.auth().signOut()}
            class="right menu item"
            to="/"
          >
            Logout
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default Navbar;
