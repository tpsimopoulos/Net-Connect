import React, { Component } from "react";
import Avatar from "../Avatar";
import { connect } from "react-redux";
import {
  addPost,
  uploadImage,
  removeImageFromPostBoxPreview,
} from "../../actions";
import "../../css/PostBox.css";

class PostBox extends Component {
  state = {
    post: "",
    charCount: 180,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      postboxImage,
      addPost,
      removeImageFromPostBoxPreview,
      username,
    } = this.props;
    if (postboxImage) {
      addPost({
        image: postboxImage,
        postAuthor: username,
        post: this.state.post,
      });
    } else {
      addPost({
        postAuthor: username,
        post: this.state.post,
      });
    }
    this.setState({ post: "" });
    this.setState({ charCount: 180 });
    this.setState({ imageUrl: "" });
    removeImageFromPostBoxPreview();
  };

  handleUploadedImage = async (e) => {
    console.log("uploaded image for preview");
    const { uploadImage } = this.props;
    await uploadImage(e, "POSTBOX");
  };

  handleRemoveImagePreviewClick = () => {
    const { removeImageFromPostBoxPreview } = this.props;
    removeImageFromPostBoxPreview();
  };

  handlePostInputChange = (e) => this.setState({ post: e.target.value });

  handleCharCountChange = (e) =>
    this.setState({ charCount: 180 - e.target.value.length });

  render() {
    const {
      postboxImage,
      formId,
      placeholder,
      replyPicLabelFor,
      replyImageInputId,
      buttonFor,
      buttonTitle,
    } = this.props;

    return (
      <div
        className={postboxImage ? "post-box__imagePost" : "post-box-textPost"}
      >
        <div className="post-box__avatar">
          <Avatar />
        </div>
        <div className="post-box__postForm">
          <form
            id={formId ? formId : "post-form"}
            onSubmit={this.handleSubmit}
            className={
              postboxImage ? "post-box__imageForm" : "post-box__textForm"
            }
          >
            {postboxImage ? (
              <div className="image-container">
                <div
                  className="close-button"
                  onClick={this.handleRemoveImagePreviewClick}
                >
                  <i className="close icon"></i>
                </div>
                <div contentEditable="true" className="post-box__imagePreview">
                  <img src={postboxImage} />
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
                placeholder={placeholder ? placeholder : "What's happening?"}
                className="post-box__textArea"
              />
            )}
          </form>
          <div className="post-box__actionsCharCount">
            <div className="post-box__imageContainer">
              <label
                for={replyPicLabelFor ? replyPicLabelFor : "picture-upload"}
              >
                <i className="images outline large icon"></i>
              </label>
              <input
                id={replyImageInputId ? replyImageInputId : "picture-upload"}
                onChange={this.handleUploadedImage}
                onClick={(e) => (e.target.value = null)}
                type="file"
              />
            </div>
            <div className="post-box__charAndPostContainer">
              <div className="post-box__charCount">{this.state.charCount}</div>
              <div className="post-box__postButtonContainer">
                <button
                  type="submit"
                  form={buttonFor ? buttonFor : "post-form"}
                  className="post-form__button"
                >
                  {buttonTitle ? buttonTitle : "Post"}
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
  return {
    username: state.firebase.profile.username,
    postboxImage: state.uploadedImage.postboxImage,
  };
};
export default connect(mapStateToProps, {
  addPost,
  uploadImage,
  removeImageFromPostBoxPreview,
})(PostBox);
