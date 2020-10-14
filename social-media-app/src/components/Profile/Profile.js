import React, { Component } from "react";
import "../../css/Profile.css";
import ProfileMenuItem from "./ProfileMenuItem";
import Navbar from "../Navbar/Navbar";

class Profile extends Component {
  state = {
    activeSelection: "Posts",
  };

  handleClick = (id) => {
    this.setState({ activeSelection: id });
  };

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div id="profile-container">
          <img
            id="profile-avatar"
            src={require("../../img/avatar.png")}
            alt="profile picture"
            className="ui avatar image"
          />
          <div className="profile-menu">
            {["Posts", "Following", "Followers"].map((menu_item) => {
              const className =
                this.state.activeSelection === menu_item
                  ? "active-item"
                  : "item";
              return (
                <ProfileMenuItem
                  key={menu_item}
                  id={menu_item}
                  name={menu_item}
                  className={className}
                  onClick={this.handleClick}
                />
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Profile;
