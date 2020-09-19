import React from 'react';


const Delete = ({ deletePost, postId }) => {

    const handleTrashClick = () => {
        deletePost(postId)
    }

    return (
        <i
            className="trash icon"
            onClick={handleTrashClick}></i>
    )
}

export default Delete;
