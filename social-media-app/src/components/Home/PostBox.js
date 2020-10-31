import React, { Component } from "react";
import PostBoxAvatar from "./PostBoxAvatar";
import { addPost } from "../../actions";
import { connect } from "react-redux";
import firebase from "../../firebase";
import "../../css/PostBox.css";
import { storage } from "firebase";

class PostBox extends Component {
  state = {
    username: this.props.username,
    post: "",
    charCount: 180,
    imageUrl: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addPost({
      image: this.state.imageUrl,
      postAuthor: this.state.username,
      post: this.state.post,
    });
    this.setState({ post: "" });
    this.setState({ charCount: 180 });
    this.setState({ imageUrl: "" });
  };

  handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();
    this.setState({ imageUrl: fileUrl });
  };

  handleRemoveImagePreviewClick = () => {
    this.setState({ imageUrl: "" });
  };

  handlePostInputChange = (e) => this.setState({ post: e.target.value });

  handleCharCountChange = (e) =>
    this.setState({ charCount: 180 - e.target.value.length });

  render() {
    return (
      <div
        className={
          this.state.imageUrl ? "post-box__imagePost" : "post-box-textPost"
        }
      >
        <div className="post-box__avatar">
          <PostBoxAvatar />
        </div>
        <div className="post-box__postForm">
          <form
            id={this.props.formId ? this.props.formId : "post-form"}
            onSubmit={this.handleSubmit}
            className={
              this.state.imageUrl ? "post-box__imageForm" : "post-box__textForm"
            }
          >
            {this.state.imageUrl ? (
              <div className="image-container">
                <div
                  className="close-button"
                  onClick={this.handleRemoveImagePreviewClick}
                >
                  <i className="close icon"></i>
                </div>
                <div contentEditable="true" className="post-box__imagePreview">
                  <img src={this.state.imageUrl} />
                </div>
              </div>
            ) : (
              <textarea
                value={this.state.post}
                onChange={(e) => {
                  this.handlePostInputChange(e);
                  this.handleCharCountChange(e);
                }}
                type="text"
                maxLength="180"
                placeholder={
                  this.props.placeholder
                    ? this.props.placeholder
                    : "What's happening?"
                }
                className="post-box__textArea"
              />
            )}
          </form>
          <div className="post-box__actionsCharCount">
            <div className="post-box__imageContainer">
              <label
                for={
                  this.props.replyPicLabelFor
                    ? this.props.replyPicLabelFor
                    : "picture-upload"
                }
              >
                <i className="images outline large icon"></i>
              </label>
              <input
                id={
                  this.props.replyImageInputId
                    ? this.props.replyImageInputId
                    : "picture-upload"
                }
                onChange={this.handleFileUpload}
                type="file"
              />
            </div>
            <div className="post-box__charAndPostContainer">
              <div className="post-box__charCount">{this.state.charCount}</div>
              <div className="post-box__postButtonContainer">
                <button
                  type="submit"
                  form={
                    this.props.buttonFor ? this.props.buttonFor : "post-form"
                  }
                  className="post-form__button"
                >
                  {this.props.buttonTitle ? this.props.buttonTitle : "Post"}
                </button>
              </div>
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
