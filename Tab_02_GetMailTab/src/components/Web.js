import React from 'react';
import AuthService from '../services/AuthService'
import { List, Icon } from "@fluentui/react";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";

class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      messages: []
    }

    this.getMessages = this.getMessages.bind(this);
  }

  async componentDidMount() {
    if (AuthService.isLoggedIn()) {
      await this.getMessages()
    }
  }

  render() {
    return (
      <div>
        <h1>react.js app to get emails with PKCE auth flow</h1>
        {AuthService.isLoggedIn() ?
          <>
            <button onClick={() => this.getMessages()}>Get Mail</button>
            <p>Username: {AuthService.getUsername()}</p>
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
          :
          <button onClick={() => AuthService.login()}>Log in</button>
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
            const user = await AuthService.getAccessToken(["Mail.Read"]);
            this.setState({
              accessToken: user.accessToken
            });
          }
          done(null, this.state.accessToken);
        }
      });
    }
  }

  async getMessages() {
    await this.initGraphClient();
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

export default Web;