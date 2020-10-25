import React, { Component } from "react";
import PostBoxAvatar from "./PostBoxAvatar";
import { addPost } from "../../actions";
import { connect } from "react-redux";
import "../../css/PostBox.css";

class PostBox extends Component {
  state = {
    username: this.props.username,
    post: "",
    charCount: 180,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addPost({
      username: this.state.username,
      post: this.state.post,
    });
    this.setState({ post: "" });
    this.setState({ charCount: 180 });
  };

  handlePostInputChange = (e) => this.setState({ post: e.target.value });

  handleCharCountChange = (e) =>
    this.setState({ charCount: 180 - e.target.value.length });

  render() {
    return (
      <div className="post-box">
        <div className="post-box__avatar">
          <PostBoxAvatar />
        </div>
        <div className="post-box__postForm">
          <form
            id="post-form"
            onSubmit={this.handleSubmit}
            className="post-box__input"
          >
            <textarea
              value={this.state.post}
              onChange={(e) => {
                this.handlePostInputChange(e);
                this.handleCharCountChange(e);
              }}
              type="text"
              maxLength="200"
              placeholder="What's happening?"
              className="post-box__input--backgroundColor
           post-box__input--size 
           post-box__input--textSize
           post-box__input--borderStyle"
            />
          </form>
          <div className="post-box__charAndButton">
            <div className="post-box__charCount">{this.state.charCount}</div>
            <div className="button-container">
              <button
                type="submit"
                form="post-form"
                className="post-form__button"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { username: state.firebase.profile.username };
};
export default connect(mapStateToProps, { addPost })(PostBox);
