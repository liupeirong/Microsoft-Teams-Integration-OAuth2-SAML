import React from 'react';
import axios from 'axios';
import prettifyXml from '../services/PrettifyXml';

class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samlUser: null,
      userTask: null
    }
    this.getSamlAssertion = this.getSamlAssertion.bind(this);
    this.getSamlUserTask = this.getSamlUserTask.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.getSamlAssertion();
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
    window.location = process.env.REACT_APP_LOGIN_URI + '?returnTo=' + encodeURIComponent(window.location.origin);
  }

  async getSamlAssertion() {
    axios({
      method: 'GET',
      url: process.env.REACT_APP_GET_SAML_ASSERTION_API,
      withCredentials: true
    })
      .then(resp => {
        this.setState({ samlUser: resp?.data?.user });
      })
      .catch(err => {
        console.error("not logged in:", err);
        this.login();
      });
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
        console.error("not logged in:", err);
      });
  }
}

export default Web;