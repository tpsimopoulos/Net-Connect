import React, { Component } from "react";
import "../../css/TextProfilePost.css";
import PostAvatar from "../PostAvatar";
// import "../../css/PostAvatar.css";
export default class TextProfilePost extends Component {
  render() {
    return (
      <div className="post-container">
        <div className="avatar-and-body-container">
          <PostAvatar />
          <div className="post-body">Test post.</div>
        </div>
        <div className="post-actions">
          <i class="retweet icon"></i>
          <i class="reply icon"></i>
          <i class="heart icon"></i>
        </div>
      </div>
    );
  }
}

{
  /* <i class="heart outline icon"></i> */
}
