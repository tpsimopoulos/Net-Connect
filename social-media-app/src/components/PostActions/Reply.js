import React, { useState } from 'react';


const Reply = () => {

    const [replyClicked, setReplyClick] = useState(false)
    const handleReplyClick = () => {
        // postSelectedForReply(postId)
        setReplyClick(!replyClicked)

    }
    const handleReplySubmit = () => { }
    return (
        <React.Fragment>
            <i
                className="reply icon"
                onClick={handleReplyClick}>
            </i>

            {
                replyClicked ?
                    <form onSubmit={handleReplySubmit} class="ui reply form">
                        <div class="field">
                            <textarea rows="2"></textarea>
                        </div>
                        <button class="ui right floated mini ui button">
                            Reply
                                        </button>
                    </form> : null
            }

        </React.Fragment>
    )
}

export default Reply;
