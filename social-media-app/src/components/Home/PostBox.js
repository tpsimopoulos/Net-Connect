import React, { Component } from "react";
import PostBoxAvatar from "./PostBoxAvatar";
import { addPost } from "../../actions";
import { connect } from "react-redux";
import "../../css/PostBox.css";

class PostBox extends Component {
  state = {
    username: this.props.username,
    post: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addPost(this.state);
    this.setState({ post: "" });
  };

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
              onChange={(e) => this.setState({ post: e.target.value })}
              type="text"
              maxLength="200"
              placeholder="What's happening?"
              className="post-box__input--backgroundColor
             post-box__input--size 
             post-box__input--textSize
             post-box__input--borderStyle"
            />
          </form>
          <button type="submit" form="post-form" className="ui primary button">
            Post
          </button>
        </div>
        {/* <div className="post-box__actions">
          <i class="image outline icon"></i>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { username: state.firebase.profile.username };
};
export default connect(mapStateToProps, { addPost })(PostBox);
