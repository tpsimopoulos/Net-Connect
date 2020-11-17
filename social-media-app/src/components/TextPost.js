import React, { Component } from "react";
import Avatar from "./Avatar";
import Modal from "./Modal";
import ReplyModal from "./ReplyModal";
import moment from "moment";
import { likePost, resharePost, deletePost } from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DropDown from "./DropDown";
import "../css/TextPost.css";
// Tie who reshared post to the post id
class TextPost extends Component {
  state = {
    replyModalOpen: false,
    likeClicked: false,
  };

  handleReplyClickOut = () => {
    this.setState({ replyModalOpen: false });
  };

  handleReplyClick = (post_id, loggedInUser) => {
    this.setState({ replyModalOpen: true });
  };

  handleReshare = (post_id, loggedInUser) => {
    const { resharePost, resharedPostId } = this.props;
    resharePost(post_id, loggedInUser, resharedPostId);
  };

  handleLike = (post_id, loggedInUser) => {
    const { likePost } = this.props;
    likePost(post_id, loggedInUser);
  };

  handleDeletePost = (post_id, loggedInUser) => {
    const { deletePost } = this.props;
    deletePost(post_id, loggedInUser);
  };

  render() {
    const {
      postAuthor,
      post_body,
      createDate,
      post_id,
      numOfLikes,
      numOfReshares,
      resharedPost,
      postResharer,
      image,
      loggedInUser,
      usersWhoLiked,
      usersWhoReshared,
      postLikers,
    } = this.props;

    return (
      <div className="text-post">
        <div className={image ? "image-post__content" : "text-post__content"}>
          <div className="text-post__avatar">
            <Avatar postAuthor={postAuthor} />
          </div>
          <div className="text-post__bodyContent">
            {resharedPost ? (
              <div className="text-post__Reshare">
                <i className="retweet icon"></i>
                {postResharer} Reshared
              </div>
            ) : (
              ""
            )}
            <div className="text-post__userAndDate">
              <h7 className="text-post__username">{postAuthor}</h7>
              <h9 className="text-post__createDate">
                {moment.unix(createDate.seconds).fromNow()}
              </h9>
            </div>
            {this.props.image ? (
              <div className="image-post-body">
                <img src={image} alt="Picture of Post" />
              </div>
            ) : (
              <Link to={`/post/${post_id}`} className="text-post__body">
                {post_body}
              </Link>
            )}
          </div>
          {postResharer === loggedInUser || postAuthor === loggedInUser ? (
            <DropDown
              actionName="Delete"
              post_id={post_id}
              onClick={this.handleDeletePost.bind(this, post_id, loggedInUser)}
            />
          ) : (
            ""
          )}
        </div>
        <div className="text-post__actionsContainer">
          <div className="text-post__actions">
            <i
              onClick={this.handleReplyClick.bind(this, post_id, loggedInUser)}
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
                (resharedPost && postResharer === loggedInUser) ||
                usersWhoReshared.hasOwnProperty(loggedInUser)
                  ? "button-clicked"
                  : ""
              }`}
              onClick={this.handleReshare.bind(this, post_id, loggedInUser)}
            >
              <span className="text-post__reshareCount">{numOfReshares}</span>
            </i>
            <i
              className={`heart icon ${
                postLikers.includes(loggedInUser) ||
                usersWhoLiked.hasOwnProperty(loggedInUser)
                  ? "button-clicked"
                  : ""
              }`}
              onClick={this.handleLike.bind(this, post_id, loggedInUser)}
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

export default connect(mapStateToProps, { likePost, resharePost, deletePost })(
  TextPost
);
