import React, { Component } from "react";
import PostBox from "./PostBox";
import PostFeed from "./PostFeed";
import "../../css/Home.css";

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="home-page">
          <div className="home-page__middle">
            <div className="middle-wrapper">
              <PostBox />
              <PostFeed />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
