import React, { Component } from "react";
import "../css/TextPost.css";
import PostAvatar from "./PostAvatar";
import Modal from "./Modal";
import ReplyModal from "./ReplyModal";
import moment from "moment";
import { likePost, resharePost } from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// Tie who reshared post to the post id
class TextPost extends Component {
  state = {
    replyModalOpen: false,
  };

  handleReplyClickOut = () => {
    this.setState({ replyModalOpen: false });
  };

  handleReplyClick = (post_id, loggedInUser) => {
    this.setState({ replyModalOpen: true });
  };

  handleReshare = (post_id, loggedInUser) => {
    const { resharePost, originalPostId } = this.props;
    resharePost(post_id, loggedInUser, originalPostId);
  };

  handleLike = (post_id, loggedInUser) => {
    const { likePost } = this.props;
    likePost(post_id, loggedInUser);
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
      image,
      loggedInUser,
      usersWhoLiked,
      usersWhoReshared,
    } = this.props;

    return (
      <div className="text-post">
        <Link to={`/post/${post_id}`}>
          <div className={image ? "image-post__content" : "text-post__content"}>
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
              {this.props.image ? (
                <div className="image-post-body">
                  <img src={image} alt="Picture of Post" />
                </div>
              ) : (
                <div className="text-post__body">{post_body}</div>
              )}
            </div>
          </div>
        </Link>
        <div className="test-container">
          <div className="text-post__actions">
            <i
              onClick={() => this.handleReplyClick(post_id, loggedInUser)}
              className="reply icon text-post__actions--white"
            ></i>
            {this.state.replyModalOpen ? (
              <Modal>
                <ReplyModal
                  modalOpen={this.state.replyModalOpen}
                  handleClickOut={this.handleReplyClickOut}
                />
              </Modal>
            ) : (
              ""
            )}
            <i
              className={`retweet icon ${
                (postReshared && postResharer === loggedInUser) ||
                usersWhoReshared.hasOwnProperty(loggedInUser)
                  ? "button-clicked"
                  : ""
              }`}
              onClick={() => this.handleReshare(post_id, loggedInUser)}
            >
              <span className="text-post__reshareCount">{numOfReshares}</span>
            </i>
            <i
              className={`heart icon ${
                usersWhoLiked.hasOwnProperty(loggedInUser)
                  ? "button-clicked"
                  : ""
              }`}
              onClick={() => this.handleLike(post_id, loggedInUser)}
            >
              <span className="text-post__likeCount">{numOfLikes}</span>
            </i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.firebase.profile.username,
  };
};

export default connect(mapStateToProps, { likePost, resharePost })(TextPost);
