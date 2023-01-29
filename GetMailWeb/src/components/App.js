import React from 'react';
import './App.css';
import { HashRouter as Router, Route } from "react-router-dom";

import AuthService from '../services/AuthService'

import Web from './Web';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      authInitialized: false
    }
  }

  componentDidMount() {
    // Update state when redirected back from identity provider
    AuthService.init().then(() => {
      this.setState({
        authInitialized: true
      });
    })
  }

  render() {
    if (!this.state.authInitialized) {
      console.log("waiting for auth");
      return (<div className="App"><p>Authorizing...</p></div>);
    } else {
      return (
        <div className="App">
          <Router>
            <Route exact path="/web" component={Web} />
            <Route exact path="/" component={Web} />
          </Router>
        </div>
      );
    }
  }
}

export default App;
