import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";

import Web from './Web';
import Tab from './Tab';
import TeamsAuthPopup from './TeamsAuthPopup';

class App extends React.Component {

  render() {
    if (window.parent === window.self) {
      console.log("not running in iFrame, work like a regular web site");
      return (
        <div className="App">
          <Router>
            <Route exact path="/web" component={Web} />
            <Route exact path="/tab" component={Web} />
            <Route exact path="/teamsauthpopup" component={TeamsAuthPopup} />
            <Route exact path="/" component={Web} />
          </Router>
        </div>
      );
    } else {
      console.log("running in iFrame (Teams tab), handle auth with popup");
      microsoftTeams.initialize(window);
      return (
        <Router>
          <Route exact path="/" component={Tab} />
        </Router>
      );
    }
  }
}

export default App;
