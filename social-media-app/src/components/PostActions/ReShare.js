import React, { useState } from 'react';

const ReShare = ({ onReShareClick, post }) => {
    const [reShares, setReShares] = useState(0);

    const handleReShareClick = () => {
        setReShares(reShares + 1)
        onReShareClick(post)
    };

    return (
        <React.Fragment>
            {
                reShares > 0 ?
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
        </React.Fragment>
    );
}

export default ReShare;



