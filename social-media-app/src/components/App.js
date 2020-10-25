// import Profile from './Profile';
import React from "react";
import { Router, Route } from "react-router-dom";
import history from "../history";
import Home from "./Home/Home";
import Origin from "./Login/Origin";
import Profile from "./Profile/Profile";
import PostDetail from "./PostDetail";
import "../css/App.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <div>
            <Route path="/" exact component={Origin} />
            <Route path="/home" exact component={Home} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/post/:post_id" exact component={PostDetail} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
