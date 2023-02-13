import React from 'react';
import './App.css';
import { HashRouter as Router, Route } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import * as Config from '../Config';

import Tab from './Tab';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.msalInstance = new PublicClientApplication(Config.msalConfig);
  }

  render() {
      if (window.parent === window.self) {
        return (
          <p>Integrated with Teams SSO, must run in Teams</p>
        );
      } else {
        return (
          <MsalProvider instance={this.msalInstance}>
            <Router>
              <Route exact path="/" component={Tab} />
            </Router>
          </MsalProvider>
        );
      }
    }
}

export default App;
