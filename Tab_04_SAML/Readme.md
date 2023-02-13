# Integrate SAML web app with Teams

In the previous samples, we went from a vanilla [single-page-app with OAuth2 PKCE auth](../Tab_01_GetMailWeb/),
 to [integrating it with a Microsoft Teams Tab](../Tab_02_GetMailTab/), to [enabling single-sign-on with Teams](../Tab_03_GetMailSSO/).
 In the enterprise world, there are still a lot of applications using SAML. This sample demonstrates
 how to integrate a [SAML app](https://github.com/liupeirong/SAML-Sample-Azure-AD) with Teams.

Here's how authentication works in this sample:

1. When a user opens the Teams Tab of this sample, the app opens a popup and directs the user to the SAML App login page [with a return URL to itself](./src/components/TeamsAuthPopup.js).
2. SAML App login page [directs the user to Azure AD to login](https://github.com/liupeirong/SAML-Sample-Azure-AD/blob/main/app.js#L68).
3. Azure AD directs the user back to the SAML app's [callback URL](https://github.com/liupeirong/SAML-Sample-Azure-AD/blob/main/app.js#L75) registered in Azure AD with the user's SAML assertion.
4. SAML App validates the assertion and stores the user's info in its session. It [redirects the user back the client URL set in #1](https://github.com/liupeirong/SAML-Sample-Azure-AD/blob/main/app.js#L79) with a session cookie.
5. This Tab app can now [use the session id to make calls to the SAML App to get data](./src/components/Tab.js#L52).

> Note that at the time of this writing, the [Teams' notion of SSO](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview),
> as demonstrated in the [previous sample](../Tab_03_GetMailSSO/), is not yet supported for SAML in that you
> [cannot exchange a Teams' auth token with a SAML token](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview#known-limitations).

## The SAML App

The [SAML app](https://github.com/liupeirong/SAML-Sample-Azure-AD) is a simple sample implemented in node.js, express.js, and passport-saml. It uses Azure AD as its identity provider and provides 2 sample APIs:

* [/users](https://github.com/liupeirong/SAML-Sample-Azure-AD/blob/main/routes/users.js) fetches the logged in user's info, including the SAML assertion from Azure AD.
* [/tasks](https://github.com/liupeirong/SAML-Sample-Azure-AD/blob/main/routes/tasks.js) retrieves strings representing tasks based on the first letter of the logged in user's id.

Please see the [readme](https://github.com/liupeirong/SAML-Sample-Azure-AD) of the sample on how to set it up.

## The client App

This app logs the user in and displays the user's SAML assertion. It can also make a call to the SAML App to retrieve the logged in user's tasks.
It works both as a standalone web app and in a Teams Tab.

To run this app locally,

* Copy .sample.env in the project root to .env and update the values. Note that if you haven't changed the defaults for the SAML app or this app, the pre-filled URLs should work.
* Configure and start the SAML app as documented in this [readme](https://github.com/liupeirong/SAML-Sample-Azure-AD). By default, it runs on `https://localhost:5000`.
* In the project root folder, run the following command:

```bash
npm install
npm start
```

* Open a browser and navigate to `https://localhost:3000` to verify everything works as a standalone web app.
* Upload the manifest of this app to Teams if you haven't already. This is same as in the [previous sample](../Tab_02_GetMailTab/).
* Navigate to the Teams tab for this app, it will prompt you to log in, then displays your SAML assertion. Once logged in, you can also click a button to retrieve tasks from the SAML App.
