import React from 'react';

const Profile = () => {
    return (
        <div className="ui grid container">
            <div className="row">
                <div className="ui column centered grid">
                    <div className="ui small circular image">
                        <img
                            alt="profile"
                            src={require('../img/avatar.png')} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="ui column centered grid">
                    <div className="ui list">
                        <div className="item">
                            <div className="content">
                                <i className="marker icon" />
                                New York, NY
                            </div>
                            <div className="item">
                                <div className="content">
                                    <i className="mail icon"></i>
                                    <a href="mailto:jack@semantic-ui.com">jack@semantic-ui.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="ui column centered grid">
                    <div className="ui compact secondary pointing menu">
                        <a className="item active" href="/"> Posts </a>
                        <a className="item" href="/"> Followers </a>
                        <a className="item" href="/"> Following </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;

