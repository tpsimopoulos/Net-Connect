// import Profile from './Profile';
import React from "react";
import { Router, Route } from "react-router-dom";
import history from "../history";
import Home from "./Home";
import Origin from "./Login/Origin";
import Profile from "./Profile/Profile";
import "../css/App.css";

function App() {
  return (
    <div>
      <Router history={history}>
        <div>
          <Route path="/" exact component={Origin} />
          <Route path="/home" exact component={Home} />
          <Route path="/profile" exact component={Profile} />
          {/* PostBox */}
          {/* Posts */}
        </div>
      </Router>
    </div>
  );
}

export default App;
