import React, { Component } from "react";
import "../../css/Profile.css";
import ProfileMenuItem from "./ProfileMenuItem";
import Navbar from "../Navbar/Navbar";
import TextProfilePost from "./TextProfilePost";
import UserInfo from "./UserInfo";
import ProfileAvatar from "./ProfileAvatar";
import PostAvatar from "../PostAvatar";

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
        <div className="profile-page">
          <div className="profile-container">
            <ProfileAvatar />
            <UserInfo />
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
            <TextProfilePost />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Profile;
