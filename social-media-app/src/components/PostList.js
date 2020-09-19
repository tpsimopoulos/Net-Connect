import React from 'react';
import Post from './Post';

const PostList = ({ deletedPost, posts, deletePost, onReShareClick, postSelectedForReply }) => {
    if (deletedPost) {
        const postList = posts.map((post, index) => {
            return (
                <Post
                    key={index}
                    postId={index}
                    deletePost={deletePost}
                    postContent={post.post}
                    postAuthor={post.author}
                    postDate={post.postDate}
                    onReShareClick={onReShareClick}
                    postSelectedForReply={postSelectedForReply} />
            );
        });
        return <div>{postList}</div>

    } else {
        const postList = posts.reverse().map((post, index) => {
            return (
                <Post
                    key={index}
                    postId={index}
                    deletePost={deletePost}
                    postContent={post.post}
                    postAuthor={post.author}
                    postDate={post.postDate}
                    onReShareClick={onReShareClick}
                    postSelectedForReply={postSelectedForReply} />
            );
        });
        return <div>{postList}</div>

    }

}

export default PostList;
