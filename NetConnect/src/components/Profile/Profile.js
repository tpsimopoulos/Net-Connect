import React, { Component } from "react";
import ProfileMenuItem from "./ProfileMenuItem";
import Avatar from "../Avatar";
import PostFeed from "../Home/PostFeed";
import { connect } from "react-redux";
import { uploadImage } from "../../actions";
import "../../css/Profile.css";

class Profile extends Component {
  state = {
    activeSelection: "Posts",
    editAvatarClicked: false,
  };

  handleUploadedImage = (e) => {
    const { uploadImage, username } = this.props;
    uploadImage(e, "PROFILE", username);
  };

  handleEditAvatarClick = () => {
    this.setState({ editAvatarClicked: !this.state.editAvatarClicked });
  };

  handleProfileMenuItemClick = (id) => {
    this.setState({ activeSelection: id });
  };

  render() {
    const { username } = this.props;
    return (
      <>
        <div className="profile-page">
          <div className="profile-page__detail">
            <div
              className="profile-page__editProfileOption"
              onClick={() => this.handleEditAvatarClick()}
            >
              <i class="edit icon"></i>
            </div>
            <div className="profile-page__avatar">
              <Avatar />
              {this.state.editAvatarClicked ? (
                <div className="edit-profile-container">
                  <form
                    className="edit-profile-form"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={this.handleSubmit}
                  >
                    <label for="avatar-upload" className="avatar-upload">
                      <i className="camera icon"></i>
                    </label>
                    <input
                      type="file"
                      id="avatar-upload"
                      onChange={this.handleUploadedImage}
                    />
                  </form>
                </div>
              ) : null}
            </div>
            <div className="user-info">{username}</div>
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
                    onClick={this.handleProfileMenuItemClick}
                  />
                );
              })}
            </div>
            <PostFeed />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.firebase.profile.username,
    auth: state.firebase.auth,
  };
};
export default connect(mapStateToProps, {
  uploadImage,
})(Profile);
