import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAvatars } from "../actions";
import _ from "lodash";
class Avatar extends Component {
  componentDidMount() {
    const { fetchAvatars } = this.props;
    fetchAvatars();
  }
  render() {
    const { avatars, postAuthor, loggedInUser } = this.props;
    let avatar_type = null;
    // if post author prop is passed in and data is ready
    if (avatars[postAuthor]) {
      const { username, avatar } = avatars[postAuthor];
      avatar_type = (
        <img
          src={avatar}
          alt={`${username}'s avatar picture`}
          className="post-avatar"
        />
      );
      // else if post author prop isn't passed in and the logged in user's avatar is ready
    } else if (avatars[loggedInUser] && !postAuthor) {
      avatar_type = (
        <img src={avatars[loggedInUser].avatar} alt="avatar picture" />
      );
    } else {
      avatar_type = (
        <img src={require("../img/avatar.png")} alt="avatar picture" />
      );
    }
    return <React.Fragment>{avatar_type}</React.Fragment>;
  }
}

const mapStateToProps = (state) => {
  return {
    avatars: state.userAvatars,
    loggedInUser: state.firebase.profile.username,
  };
};

export default connect(mapStateToProps, { fetchAvatars })(Avatar);
