import React from 'react';
import Post from './Post';

const PostList = ({ posts, onReShareClick, postSelectedForReply }) => {
    const postList = posts.reverse().map((post, index) => {
        return (
            <Post
                key={index}
                postId={index}
                postContent={post}
                onReShareClick={onReShareClick}
                postSelectedForReply={postSelectedForReply} />
        )
    })
    return <div>{postList}</div>
}

export default PostList;