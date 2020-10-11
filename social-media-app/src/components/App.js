// import Profile from './Profile';
import React from "react";
import { Router, Route } from "react-router-dom";
import history from "../history";
import Home from "./Home";
import Origin from "./Origin";

function App() {
  return (
    <div className="ui container">
      <Router history={history}>
        <div>
          <Route path="/" exact component={Origin} />
          <Route path="/home" exact component={Home} />
          {/* Sign In */}
          {/* PostBox */}
          {/* Posts */}
        </div>
      </Router>
    </div>
  );
}

export default App;
