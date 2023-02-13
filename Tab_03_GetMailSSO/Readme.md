# Web app integrated with Microsoft Teams with Single-Sign-On (SSO)

We've gone from the [first sample of a vanilla single-page-app (SPA)](../Tab_01_GetMailWeb/) to the
 [second sample of integrating the SPA into a Microsoft Teams Tab](../Tab_02_GetMailTab/).
 In this sample, we further demonstrate what it means to [enable SSO when integrating with Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview).

The [previous sample](../Tab_02_GetMailTab/) still relies on the SPA app to log the user in and obtain the auth token to access backend APIs such as Graph API.
 When the user navigates away from the tab, the SPA state is lost. So when the user comes back, the app pops up for login again.
 The user doesn't have to enter credentials in subsequent logins as long as they are still in Teams because Azure AD has session cookies preserved across tabs.

In this sample, it's no longer the SPA app that logs the user in. The SPA app [uses Teams SDK to get an auth token](./src/components/Tab.js#L25)
 for the user that already logged into Teams. It then [sends this token to its backend server](./src/components/Tab.js#L31),
 a confidential client, that exchanges the token for an auth token that allow for access to the final APIs on behalf of the user.
 Since it's Teams that logs the user in and these token exchanges don't require user interaction, users no longer see a popup for login or for subsequent access to the tab app.
 This is Teams' notion of SSO.

## The backend Server

Because we rely on a confidential client to exchange the app token to an on-behalf-token for the user to access the target APIs,
 we need a backend server to act as this confidential client. In this sample, it's a simple [Node.js server](./server/server.js).
 The server [creates a confidential client](./server/server.js#L19) and
 [exchanges the access token provided by Teams to get a token for accessing Graph API](./server/server.js#L36).
 This sample is requesting permission to read the user's [emails](./server/server.js#L32) and [sends the data to the frontend](./server/server.js#L59).

To run the backend server:

* Install [NodeJS](https://nodejs.org/en/).
* [Register or adjust the registration of the Azure AD App](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-register-aad) for SSO.
* Copy [.sample.env](server/.sample.env) in the `server` folder to `.env` in the same `server` folder and configure the values.
* In the `server` folder, run:

```bash
npm install
npm start
```

## The frontend app

The frontend is still a [react.js app](./src/components/Tab.js) except it no longer logs the user in. It relies on Teams to obtain a token to send to the backend server,
 and relies on the backend server to access Graph API on user's behalf. It then simply displays the data. For simplicity, this frontend app
 only runs in a Teams Tab.

To run the frontend app:

* Add the [webApplicationInfo section to the Teams app manifest](../GetMailWebTab/TeamsAppPackage/manifest.json#L49) in the previous sample and upload the app to Teams again.
* Copy [.sample.env](.sample.env) in the project root folder to `.env`, and configure the values.
* In the project root folder, run:

```bash
npm install
npm start
```

## Summary

We've gone from a [vanilla single-page-app](../Tab_01_GetMailWeb/), to [integrate it in a Teams Tab](../Tab_02_GetMailTab/),
 to enabling single-sign-on in this sample so the user doesn't need to log in again once they are in Teams.
 In the [next sample](../Tab_04_SAML/) we'll demonstrate how to integrate a SAML web app with Teams.
