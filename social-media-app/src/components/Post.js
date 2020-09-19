import React, { useState } from 'react';
import Avatar from './Avatar';
import PostActions from './PostActions/PostActions';
import Like from './PostActions/Like';
import ReShare from './PostActions/ReShare';
import Reply from './PostActions/Reply';
import Delete from './PostActions/Delete';

const Post = ({ deletePost, postId, onReShareClick, postSelectedForReply, postContent, postAuthor, postDate }) => {
    return (
        <div className="ui grid container">
            <div className="row">
                <div className="twelve wide column centered grid">
                    <div className="ui feed">
                        <div className="event">
                            <div className="label">
                                <Avatar alt='profile' />
                            </div>
                            <div className="content">
                                <div className="summary">
                                    <a>{postAuthor}</a>
                                    <div className="date">{postDate}</div>
                                </div>
                                <div className="extra text">
                                    {postContent}
                                </div>
                                <PostActions>
                                    <Like />
                                    <ReShare onReShareClick={onReShareClick} post={postContent} />
                                    <Reply />
                                    <Delete deletePost={deletePost} postId={postId} />
                                </PostActions>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Post;