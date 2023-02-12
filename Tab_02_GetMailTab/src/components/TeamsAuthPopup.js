import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import AuthService from "../services/AuthService";

class TeamsAuthPopup extends React.Component {

  componentDidMount() {
    if (microsoftTeams) {
      microsoftTeams.initialize(() => {
        microsoftTeams.getContext((context, error) => {
          if (context) {
            if (!AuthService.isLoggedIn()) {
              AuthService.login();
            } else {
              // get the scopes parameters, assuming it's the first parameter in the format of ?scopes=User.Read,Mail.Read
              const params = window.location.href.split('?');
              const scopesParams = params.length > 1 ? params[1].split(/[=,]+/) : null;
              const scopes = scopesParams && scopesParams.length > 1 ? scopesParams.slice(1) : null;
              console.log("scopes from popup url:", scopes);
              AuthService.getAccessToken(scopes)
                .then(({ username, accessToken, expiresOn }) => {
                  if (accessToken) {
                    const response = JSON.stringify({ username, accessToken, expiresOn })
                    microsoftTeams.authentication.notifySuccess(response);
                  } else {
                    microsoftTeams.authentication.notifyFailure("Unexpected failure - null token received");
                  }
                })
                .catch((error) => {
                  microsoftTeams.microsoftTeams.notifyFailure(error);
                });
            }
          }
        });
      })
    };
  }

  render() {
    return (<p>Authorizing...</p>);
  }
}

export default TeamsAuthPopup;