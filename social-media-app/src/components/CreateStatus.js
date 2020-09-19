import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';

const CreateStatus = ({ onPostButtonClick }) => {


    const [post, setPost] = useState('')
    const [author, setAuthor] = useState('')


    const handleClick = (event) => {
        event.preventDefault();
        setAuthor('Mike Scott')
        if (author.length === 0 || post.length === 0) {
            return
        }
        onPostButtonClick({ post, author })

    }

    return (
        <div>
            <div className="ui grid container">
                <div className="row">
                    <div className="ui twelve wide column centered grid">
                        <div className="ui left aligned segment">
                            <div className="ui small fluid icon input">
                                <div className="ui avatar image">
                                    <Avatar alt='profile' />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Insert post"
                                    value={post}
                                    onChange={(e) => setPost(e.target.value)} />
                                <button
                                    className="ui right floated button"
                                    onClick={handleClick}>
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >)


}


export default CreateStatus;

