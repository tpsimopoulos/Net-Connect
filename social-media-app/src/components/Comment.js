import React from 'react';


const Comment = () => {
    return (
        <div className="ui grid container">
            <div class="right floated left aligned twelve wide column">
                <div className="ui comments">
                    <div className="comments">
                        <div className="comment">
                            <a className="avatar">
                                <img alt="avatar" src={require('../img/avatar.png')} />
                            </a>
                            <div className="content">
                                <a className="author">Jenny Hess</a>
                                <div className="metadata">
                                    <span className="date">Just now</span>
                                </div>
                                <div className="text">
                                    Elliot you are always so right :)
                                </div>
                                <div className="actions">
                                    <a className="reply">Reply</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Comment;