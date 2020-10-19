import React, { Component } from "react";
import ProfileMenuItem from "./ProfileMenuItem";
import Navbar from "../Navbar/Navbar";
import TextPost from "../TextPost";
import UserInfo from "./UserInfo";
import ProfileAvatar from "./ProfileAvatar";
import { Redirect } from "react-router-dom";
import "../../css/Profile.css";
import { connect } from "react-redux";

class Profile extends Component {
  state = {
    activeSelection: "Posts",
  };

  handleClick = (id) => {
    this.setState({ activeSelection: id });
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/" />;

    return (
      <React.Fragment>
        <Navbar />
        <div className="profile-page">
          <div className="profile-page__detail">
            <div className="profile-page__editProfileOption">
              <i class="edit icon"></i>
            </div>
            <div className="profile-page__avatar">
              <ProfileAvatar />
            </div>
            <UserInfo />
            <div className="profile-page__menu">
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
            <TextPost />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};
export default connect(mapStateToProps)(Profile);
