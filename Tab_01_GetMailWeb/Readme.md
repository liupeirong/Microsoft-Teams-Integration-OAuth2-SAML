# Single-Page-App that reads emails from Microsoft Graph using PKCE OAuth flow

This sample is the first in this series of samples in understanding how OAuth flows work in
 [apps built on Microsoft Teams platform](https://learn.microsoft.com/en-us/microsoftteams/platform/overview). The Microsoft documentation and tutorials are comprehensive. However, I found it still challenging to really understand how auth and single-sign-on work. The idea of this repo is to demonstrate how to go from an existing web app to a Teams app with a focus on how to integrate auth.

This app is refactored from the [tab-aad-msal2 sample](https://github.com/pnp/teams-dev-samples/tree/main/samples/tab-aad-msal2), but it doesn't have any Teams-specific code. It features the following:

* It's a single-page-app written in React.js.
* It uses MSAL library to implement PKCE auth flow with Azure AD.
* Once authenticated with Azure AD, it requests an additional scope to read user's emails from Microsoft Graph.

You need to register an application in Azure AD:

* Register a **single-tenant**, **single-page-application(SPA)** with a **redirect URL** where your app runs, for example, `https://localhost:3000`.
* Ensure no checkbox is ticked in the **Implicit grant and hybrid flows** section in the Azure AD **Authentication** tab.
* In **API permissions** tab, add a permission **Microsoft Graph Mail.Read**.

To run the app locally,

1. Create a certificate for https, place the crt file and key file somewhere on your disk.
2. Go to the project root directory, copy `.sample.env` to `.env`, and fill in your own values.
3. Run the following commands:

```bash
npm install
npm start
```

The app runs on `https://localhost:3000` by default. Open a browser to access it.
In later samples, we will refactor this app to work in Microsoft Teams.
