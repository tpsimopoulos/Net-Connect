import React, { Component } from "react";
import "../css/TextPost.css";
import PostAvatar from "./PostAvatar";
import moment from "moment";
import { likePost, resharePost, addPost } from "../actions";
import { connect } from "react-redux";
class TextPost extends Component {
  handleTextSize = (post_body) => {
    if (post_body.length > 130) {
      return "text-post__largeBody";
    } else {
      return "text-post__smallBody";
    }
  };

  handleReshare = (post_id) => {
    const { resharePost } = this.props;
    resharePost(post_id);
  };

  handleLike = (id) => {
    const { likePost } = this.props;
    likePost(id);
  };

  render() {
    const {
      user,
      post_body,
      createDate,
      post_id,
      numOfLikes,
      numOfReshares,
      postReshared,
      postResharer,
    } = this.props;
    return (
      <div className={this.handleTextSize(post_body)}>
        <div className="text-post__content">
          <div className="text-post__avatar">
            <PostAvatar />
          </div>
          <div className="text-post__bodyContent">
            {postReshared ? (
              <div className="text-post__Reshare">
                <i className="retweet icon"></i>
                {postResharer} Reshared
              </div>
            ) : (
              ""
            )}
            <div className="text-post__userAndDate">
              <h7 className="text-post__username">{user}</h7>
              <h9 className="text-post__createDate">
                {moment.unix(createDate.seconds).fromNow()}
              </h9>
            </div>
            <div className="text-post__body">{post_body}</div>
          </div>
        </div>
        <div className="text-post__actions">
          <i className="reply icon text-post__actions--white"></i>
          <i
            className="retweet icon text-post__actions--white"
            onClick={() => this.handleReshare(post_id)}
          >
            <span className="text-post__reshareCount">{numOfReshares}</span>
          </i>
          <i
            className="heart icon text-post__actions--white"
            onClick={() => this.handleLike(post_id)}
          >
            <span className="text-post__likeCount">{numOfLikes}</span>
          </i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postResharer: state.firebase.profile.username,
  };
};

export default connect(mapStateToProps, { likePost, resharePost })(TextPost);
