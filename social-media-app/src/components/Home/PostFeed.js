import React, { Component } from "react";
import TextPost from "../TextPost";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class PostFeed extends Component {
  findMax = (postArray) => {
    let currentMax = 0;
    let latestPost = 0;
    const firebasePosts = [...postArray];
    for (let i = 0; i < firebasePosts.length; i++) {
      if (firebasePosts[i].postReshared) {
        let maxDate = Math.max(
          firebasePosts[i].reshareDate.seconds,
          firebasePosts[i].createdAt.seconds
        );
        if (maxDate > currentMax) {
          currentMax = maxDate;
          latestPost = i;
        }
      } else if (firebasePosts[i].createdAt.seconds > currentMax) {
        currentMax = firebasePosts[i].createdAt.seconds;
        latestPost = i;
      }
    }
    return latestPost;
  };

  orderedPosts = (posts) => {
    var sortedPosts = [];
    const firebasePosts = [...posts];
    while (firebasePosts.length > 0) {
      sortedPosts.push(...firebasePosts.splice(this.findMax(firebasePosts), 1));
    }
    return sortedPosts;
  };

  render() {
    const { auth, posts } = this.props;
    if (!auth.uid) return <Redirect to="/" />;
    return (
      <div className="post-feed">
        {posts &&
          this.orderedPosts(posts).map((post) => {
            return (
              <TextPost
                key={post.id}
                user={post.postAuthor}
                post_body={post.post}
                createDate={post.createdAt}
                post_id={post.id}
                numOfLikes={post.likes}
                numOfReshares={post.reshares}
                postReshared={post.postReshared}
                postResharer={post.postResharer}
                image={post.image}
                originalPostId={post.originalPostId}
                usersWhoLiked={post.usersWhoLiked}
                usersWhoReshared={post.usersWhoReshared}
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
