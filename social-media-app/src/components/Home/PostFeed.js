import React, { Component } from "react";
import TextPost from "../TextPost";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
class PostFeed extends Component {
  render() {
    const { posts, auth } = this.props;
    if (!auth.uid) return <Redirect to="/" />;
    return (
      <div className="post-feed">
        {posts &&
          posts.map((post) => {
            return (
              <TextPost
                key={post.id}
                user={post.user}
                post_body={post.post_body}
              />
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "posts" }])
)(PostFeed);
