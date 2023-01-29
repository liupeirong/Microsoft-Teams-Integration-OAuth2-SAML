import React from 'react';
import { List, Icon } from "@fluentui/react";
import * as microsoftTeams from "@microsoft/teams-js";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      messages: []
    }
  }

  componentDidMount() {
    microsoftTeams.initialize(() => {
      microsoftTeams.getContext((context, error) => {
        this.setState({ context: context });
      });

      let authTokenRequestOptions = {
        successCallback: (result) => { this.ssoLoginSuccess(result) },
        failureCallback: (error) => { this.ssoLoginFailure(error) }
      };

      microsoftTeams.authentication.getAuthToken(authTokenRequestOptions);
    });
  }

  ssoLoginSuccess = async (result) => {
    console.log("SSO got result:", result);
    this.exchangeClientTokenForServerToken(result);
  }

  ssoLoginFailure = (error) => {
    console.error("SSO failed: ", error);
  }

  exchangeClientTokenForServerToken = async (token) => {

    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers
    };

    // set proxy in package.json to go to localhost and avoid CORS
    const response = await fetch("/getGraphAccessToken", options)
      .catch((err) => {
        console.error("unhandled fetch error:", err);
      });
    console.log("response:", response);

    if (!response.ok) {
      console.log(`not ok response: ${response}`)
    }
    else if (response.ok) {
      const data = await response.json().catch(this.unhandledFetchError);
      const dataError = data['errorMessage']
      if (dataError) {
        console.log(`ok response, no data: ${dataError}`)
      } else {
        this.setState(Object.assign({}, this.state, {
          messages: data.value
        }));
      }
    }
  }

  render() {
    return (
      <div>
        <h1>List user's emails</h1>
        <p>Username: {this.state.context['upn']}</p>
        <List selectable>
          {
            this.state.messages.map(message => (
              <List.Item
                key={message.receivedDateTime}
                media={<Icon name="email"></Icon>}
                header={message.receivedDateTime}
                content={message.subject}>
              </List.Item>
            ))
          }
        </List>
      </div>
    );
  }
}

export default Tab;