// import Profile from './Profile';
import React, { useState } from 'react';
import CreateStatus from './CreateStatus';
import PostList from './PostList';

function App() {

  const [postList, updatePostList] = useState([])
  // const [replyPost, setReplyPost] = useState(0)
  const [deletedPost, setDeletedPost] = useState(false)

  const returnPost = ({ post, author }) => {
    const date = new Date();
    const postDate = date.getTime()
    updatePostList([...postList, { post, author, postDate }])
  }

  // const commentThread = (id) => {
  //   setReplyPost(id)
  //   // Need to insert reply message below this post id
  // }

  const deletePost = (id) => {
    let posts = [...postList];
    posts.splice(id, 1);
    updatePostList(posts)
    setDeletedPost(!deletedPost)
  }

  return (
    <div >
      <div className="ui secondary  menu">
        <a className="active item">Home</a>
        <a className="item">Messages </a>
        <a className="item">Friends</a>
        <div className="right menu">
          <a className="ui item">Logout</a>
        </div>
      </div>
      <CreateStatus
        onPostButtonClick={returnPost} />
      <PostList
        posts={postList}
        deletePost={deletePost}
        onReShareClick={returnPost}
        // postSelectedForReply={commentThread}
        deletedPost={deletedPost}
      />
    </div>
  );
}

export default App;
