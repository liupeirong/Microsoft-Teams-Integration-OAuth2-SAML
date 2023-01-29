import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamsAuthService from '../services/TeamsAuthService';
import prettifyXml from '../services/PrettifyXml';
import axios from 'axios';

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samlUser: null,
      userTask: null
    }
    this.getSamlUserTask = this.getSamlUserTask.bind(this);
    this.login = this.login.bind(this);
  }

  // microsoftTeams.authentication.authenticate can't be called before the tab is loaded.
  // tab can't be loaded until componentDidMount run. Otherwise, it will bring up a browser window during auth.
  componentDidMount() {
    if (!this.state.samlUser) {
      microsoftTeams.getContext((context, error) => {
        if (context) {
          this.login();
        }
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.samlUser ?
          <>
            <h1>Hi {this.state.samlUser.firstName}!</h1>
            <button onClick={() => this.getSamlUserTask()}>Get tasks</button><h1>Your task: {this.state.userTask}</h1>
            <h1>Here's your saml assertion:</h1>
            <pre lang="xml">{prettifyXml(this.state.samlUser.assertionXml)}</pre>
          </>
          :
          <p>Authenticating...</p>
        }
      </div>
    );
  }

  async login() {
    const user = await TeamsAuthService.login(microsoftTeams);
    this.setState({ samlUser: user });
  }

  async getSamlUserTask() {
    axios({
      method: 'GET',
      url: process.env.REACT_APP_GET_TASK_API,
      withCredentials: true
    })
      .then(resp => {
        console.log(resp);
        this.setState({ userTask: resp?.data?.task });
      })
      .catch(err => {
        console.error("get user task error:", err);
      });
  }
}

export default Tab;