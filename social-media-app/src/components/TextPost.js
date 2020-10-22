import React, { Component } from "react";
import "../css/TextPost.css";
import PostAvatar from "./PostAvatar";
import moment from "moment";
export default class TextPost extends Component {
  render() {
    return (
      <div className="text-post">
        <div className="text-post__content">
          <div className="text-post__avatar">
            <PostAvatar />
          </div>
          <div className="text-post__bodyContent">
            <h8 className="text-post__createDate">
              {moment
                .unix(this.props.createDate.seconds)
                .format("MMMM Do YYYY, h:mm a")}
            </h8>
            <h8 className="text-post__username">{this.props.user}</h8>
            <div className="text-post__body">{this.props.post_body}</div>
          </div>
        </div>
        <div className="text-post__actions">
          <i className="retweet icon text-post__actions--white"></i>
          <i className="reply icon text-post__actions--white"></i>
          <i className="heart icon text-post__actions--white"></i>
        </div>
      </div>
    );
  }
}
