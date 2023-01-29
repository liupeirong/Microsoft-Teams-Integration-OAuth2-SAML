# Introduction

This repo contains a series of samples to help understand how to build a Microsoft Teams Tab app that integrates with
 Azure AD authentication and authorization. It progressively builds up auth functionalities as following:

1. It starts with a [regular web app](./GetMailWeb/) that accesses Microsoft Graph API,
2. then [enables it to be integrated in a Teams Tab](./GetMailWebTab/),
3. then improves the auth experience such that the user sees the [Tab with data populated without any popup](./GetMailWebTabSSO/) after navigating away and back to the Tab.
4. The last example is [integrates a SAML app into Teams](./SamlSampleTab/).

The motivations for building these samples are the following:

* Auth is complex in a regular Web app, it's even more complex when you try to integrate a custom app with Teams where user is already signed in and should not be asked to sign in multiple times.
* A Teams Tab app runs in an iFrame where identity providers don't allow redirect due to the risk of [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking). You need to pop up a dialog to work around this limitation.
* While the official Teams developer tutorial is great, I found it a bit hard to truely understand the concepts because it uses different samples and coding styles when building additional features.
* Enterprises still have a lot of SAML apps. It's hard to find examples on integrating OAuth with SAML.

## Postman collection

To help further understand how authentication works, the [Postman collection in this project root](./TeamsApp.postman_collection.json) includes the raw http calls to obtain auth tokens. Here are the calls in the collection:

1. `GetAuthCode` obtains the OAuth2 authorization code for the auth code flow. It should run in a browser so the user can interactively log in to Azure AD. Once logged in, Azure AD will redirect back to `localhost` with the authorization code in the URL.

   > Tips on generating PKCE code challenges
   >
   > * generate a random string 43 to 128 characters long as a PKCE `code verifier`
   > * convert the string to sha256
   > * the output of sha256 should be used as hex rather than string to convert to base64 as the `code challenge`.

2. `GetAccessToken` obtains the OAuth2 access token for the Teams app.
3. `GetAccessTokenPostman` uses Postman auth functionality to achieve the same as the above 2 manual steps.
4. `GetOBOToken` exchanges the Teams app token for an on-behalf-of token for the Teams app to to access the target API, such as Graph API. This is how [Teams Single-Sign-On](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview) work.
5. `GetOBOTokenSaml` exchanges the [Teams app token for a SAML assertion](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#saml-assertions-obtained-with-an-oauth20-obo-flow), using the on-behalf-of flow, for the target SAML app that the Teams app is trying to access. Note that [Teams SDK only supports OAuth2 token, it doesn't support SAML token](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview#known-limitations) at the time of this writing.
6. `GetGraphMe` uses the access token obtained in step 4 to access a Graph API.

## What's not demonstrated

* Proper handling of initial and incremental consent.
* Proper handling of token expiration.
* Logout.
* Auth integration with Teams Bot app, meeting, chat etc.
