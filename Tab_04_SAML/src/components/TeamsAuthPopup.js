import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import axios from 'axios';

class TeamsAuthPopup extends React.Component {

  componentDidMount() {
    if (microsoftTeams) {
      microsoftTeams.initialize(() => {
        microsoftTeams.getContext((context, error) => {
          if (context) {
            this.getSamlAssertion();
          }
        });
      })
    };
  }

  RedirectToLogin() {
    window.location = process.env.REACT_APP_LOGIN_URI + '?returnTo=' + encodeURIComponent(process.env.REACT_APP_AUTH_RETURN_URI);
  }

  getSamlAssertion() {
    axios({
      method: 'GET',
      url: process.env.REACT_APP_GET_SAML_ASSERTION_API,
      withCredentials: true
    })
      .then(resp => {
        const user = resp?.data?.user;
        user ?  microsoftTeams.authentication.notifySuccess(user) : microsoftTeams.authentication.notifyFailure("no user found");
      })
      .catch(err => {
        console.error(err);
        this.RedirectToLogin();
      });
  }

  render() {
    return (<p>Authorizing...</p>);
  }
}

export default TeamsAuthPopup;