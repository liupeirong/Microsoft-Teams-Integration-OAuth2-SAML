import React from 'react';
import { List, Icon } from "@fluentui/react";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as microsoftTeams from "@microsoft/teams-js";
import TeamsAuthService from '../services/TeamsAuthService'

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      messages: []
    }

    this.getMessages = this.getMessages.bind(this);
  }

  // microsoftTeams.authentication.authenticate can't be called before the tab is loaded.
  // tab can't be loaded until componentDidMount run. Otherwise, it will bring up a browser window during auth.
  // so can't auth to get mail here, instead, push the "get mail" button.
  async componentDidMount() {
    microsoftTeams.initialize();
    // if (AuthService.isLoggedIn()) {
    //   await this.getMessages();
    // } 
  }

  render() {
    return (
      <div>
        <h1>Log the user in and list the user's emails</h1>
        {
          <>
            <button onClick={() => this.getMessages()}>Get Mail</button>
            <p>Username: {TeamsAuthService.getUsername()}</p>
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
          </>
        }
      </div>
    );
  }

  async initGraphClient() {
    if (!this.msGraphClient) {
      this.msGraphClient = MicrosoftGraphClient.Client.init({
        authProvider: async (done) => {
          if (!this.state.accessToken) {
            // Might redirect the browser and not return; will redirect back if successful
            const user = await TeamsAuthService.getAccessToken(["Mail.Read"], microsoftTeams);
            // if we only want an ID token, do the following. It won't get mails, but the token will be in the console.
            //const user = await TeamsAuthService.getAccessToken(null, microsoftTeams);
            console.log("accessToken:", user.accessToken)
            this.setState({
              accessToken: user.accessToken
            });
          }
          done(null, this.state.accessToken);
        }
      });
    }
  };

  async getMessages() {
    console.log("getting messages...");
    if (!this.msGraphClient) {
      await this.initGraphClient();
    }
    this.msGraphClient
      .api("me/mailFolders/inbox/messages")
      .select(["receivedDateTime", "subject"])
      .top(15)
      .get(async (error, rawMessages, rawResponse) => {
        if (!error) {
          this.setState(Object.assign({}, this.state, {
            messages: rawMessages.value
          }));
        } else {
          this.setState({
            error: error
          });
        }
      });
  }
}

export default Tab;