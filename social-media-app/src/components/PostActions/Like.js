import React, { useState } from 'react';

const Like = () => {
    const [likes, setLikes] = useState(0)

    return (
        <React.Fragment>
            { likes > 0 ?
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
                </a>}
        </React.Fragment>

    )
}

export default Like;