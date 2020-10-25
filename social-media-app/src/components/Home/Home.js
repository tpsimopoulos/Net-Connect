import React, { Component } from "react";
import PostBox from "./PostBox";
import PostFeed from "./PostFeed";
import Navbar from "../Navbar/Navbar";
import "../../css/Home.css";
import TextPost from "../TextPost";

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
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
