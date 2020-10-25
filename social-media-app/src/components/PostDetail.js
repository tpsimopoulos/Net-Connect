import React, { Component } from "react";
import TextPost from "./TextPost";
import Navbar from "./Navbar/Navbar";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { fetchPosts } from "../actions";
import "../css/PostDetail.css";
class PostDetail extends Component {
  render() {
    if (this.props.posts !== undefined) {
      const text_post = this.props.posts.filter(
        (post) => post.id === this.props.match.params.post_id
      );
      console.log(text_post);
      return (
        <React.Fragment>
          <Navbar />
          <div className="post-detail">
            <div className="post-detail__main">
              <TextPost
                key={text_post[0].id}
                user={text_post[0].username}
                post_body={text_post[0].post}
                createDate={text_post[0].createdAt}
                post_id={text_post[0].id}
                numOfLikes={text_post[0].likes}
                numOfReshares={text_post[0].reshares}
              />
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  var store_posts = state.firestore.ordered.posts;
  let route_id = ownProps.match.params.post_id;
  return {
    posts: store_posts,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "posts" }])
)(PostDetail);
