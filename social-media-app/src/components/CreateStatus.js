import React, { useState } from 'react';

const CreateStatus = ({ onPostButtonClick }) => {
    const [post, setPost] = useState('')

    const handleClick = (event) => {
        event.preventDefault();

        onPostButtonClick(post)
    }

    return (
        <div>
            <div className="ui grid container">
                <div className="row">
                    <div className="ui twelve wide column centered grid">
                        <div className="ui left aligned segment">
                            <div className="ui small fluid icon input">
                                <div className="ui avatar image">
                                    <img
                                        alt="profile"
                                        src={require('../img/avatar.png')} />
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

