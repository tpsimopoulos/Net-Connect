import React, { useState } from 'react';

const Post = ({ postId, postContent, onReShareClick, postSelectedForReply }) => {

    const [likes, setLikes] = useState(0)
    const [reShares, setReShares] = useState(0)

    const handleReShareClick = () => {
        setReShares(reShares + 1)
        onReShareClick(postContent)
    }

    const handleReplyClick = () => {
        postSelectedForReply(postId)
    }

    return (
        <div className="ui grid container">
            <div className="row">
                <div className="twelve wide column centered grid">
                    <div className="ui feed">
                        <div className="event">
                            <div className="label">
                                <img alt="avatar" src={require('../img/avatar.png')} />
                            </div>
                            <div className="content">
                                <div className="summary">
                                    <a>Joe Henderson</a>
                                    <div className="date">3 days ago</div>
                                </div>
                                <div className="extra text">
                                    {postContent}
                                </div>
                                <div className="meta">
                                    {likes > 0 ?
                                        <a className="like">
                                            <i
                                                className="like icon"
                                                onClick={() => setLikes(likes + 1)}
                                            >
                                            </i> {likes}
                                        </a>
                                        :
                                        <a className="like">
                                            <i
                                                className="like icon"
                                                onClick={() => setLikes(likes + 1)}
                                            >
                                            </i>
                                        </a>
                                    }
                                    {reShares > 0 ?
                                        <a className="retweet">
                                            <i
                                                className="retweet icon"
                                                onClick={handleReShareClick}
                                            >
                                            </i> {reShares}
                                        </a>
                                        :
                                        <i
                                            className="retweet icon"
                                            onClick={handleReShareClick}
                                        >
                                        </i>
                                    }
                                    <i
                                        className="reply icon"
                                        onClick={handleReplyClick}>
                                    </i>
                                    <i className="trash icon"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Post;