import React from "react";
import { Link } from "react-router-dom";
import fire from "../fire";

const Navbar = () => {
  return (
    <React.Fragment>
      <div class="ui secondary pointing menu">
        <a class="item active">Home</a>
        <a class="item">Messages</a>
        <a class="item">Friends</a>
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
};

export default Navbar;
