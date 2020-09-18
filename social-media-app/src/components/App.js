// import Profile from './Profile';
import React, { useState } from 'react';
import CreateStatus from './CreateStatus';
import PostList from './PostList';
import Comment from './Comment';

function App() {

  // const [currentPost, setCurrentPost] = useState('')
  const [postList, updatePostList] = useState([])
  const [replyPost, setReplyPost] = useState(0)

  const returnPost = (post) => {
    updatePostList([...postList, post])
  }

  const commentThread = (id) => {
    setReplyPost(id)
    // Need to insert reply message below this post id
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
      {/* <Profile /> */}
      <CreateStatus onPostButtonClick={returnPost} />
      <PostList posts={postList} onReShareClick={returnPost} postSelectedForReply={commentThread} />
    </div>
  );
}

export default App;
