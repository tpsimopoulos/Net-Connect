import React, { Component } from "react";
import PostBox from "./Home/PostBox";
import "../css/PostBox.css";
import "../css/ReplyModal.css";
export default class ReplyModal extends Component {
  state = {
    username: this.props.username,
    reply: "",
    charCount: 180,
    imageUrl: "",
  };

  handleReplyInputChange = (e) => {
    this.setState({ reply: e.target.value });
  };

  handleCharCountChange = (e) =>
    this.setState({ charCount: 180 - e.target.value.length });

  render() {
    return (
      <div
        style={{ display: this.props.modalOpen ? "block" : "none" }}
        className="replyModal"
        onClick={() => {
          this.props.handleClickOut();
        }}
      >
        <div className="replyModal__container">
          <div
            onClick={(e) => e.stopPropagation()}
            className="replyModal__content "
          >
            <PostBox
              placeholder="Share your reply"
              buttonTitle="Reply"
              formId="reply-form"
              buttonFor="reply-form"
              replyPicLabelFor="reply-pic"
              replyImageInputId="reply-pic"
            />
          </div>
        </div>
      </div>
    );
  }
}
