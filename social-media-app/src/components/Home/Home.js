import React, { Component } from "react";
import PostBox from "./PostBox";
import PostFeed from "./PostFeed";
import Navbar from "../Navbar/Navbar";
import "../../css/Home.css";

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="home-page">
          <div className="home-page__middle">
            <PostBox />
            <PostFeed />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
