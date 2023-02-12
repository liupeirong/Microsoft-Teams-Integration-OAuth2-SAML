# Single-Page-App integrated with Microsoft Teams

This sample builds on top of the [single-page-app (SPA) that reads user's email from Microsoft Graph](../GetMailWeb/),
 and integrates it into a Microsoft Teams Tab. It intentionally doesn't yet implement [Microsoft Teams' notion of single-sign-on](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview) so we can clearly show the distinct meaning of SSO in Teams in the [next sample](../GetMailWebTabSSO/).

This app is refactored from the [tab-aad-msal2 sample](https://github.com/pnp/teams-dev-samples/tree/main/samples/tab-aad-msal2).
 It's aimed to help understand the following when integrating auth with Teams:

* React.js "state" is lost when you navigate away from this app tab to another tab and navigate back.
* With the react state lost, the app will request the user to login again. However Azure AD has session cookies that help the user to log in without asking for credentials again. The end result is that the user will see a popup for login, but gets logged in without entering their credentials.
* Teams Tab app runs in an iframe. Most identity providers, Azure AD included, don't allow redirect in iframe to avoid [clickjacking](https://owasp.org/www-community/attacks/Clickjacking) where a malicious site could put an invisible `div` on top the UI that looks like a legitimate identity provider and steal user's credentials. So to integrate with Teams Tab, you need to make changes like this to a regular SPA:
  * Add [Tab.js](src/components/Tab.js) which the Teams tab will [route](src/components/App.js#L52) to.
  * Instead of [AuthService.js](src/services/AuthService.js) that redirects the user to log in, added [TeamsAuthService.js](src/services/TeamsAuthService.js) that [pops up a dialog](src/components/TeamsAuthPopup.js) for users to log in.

If you registered an application in Azure AD in the [previous sample](../GetMailWeb/), you don't have to do it again unless you changed any configurations.
 Otherwise, register it same as before. You can run it locally same as before.

To run the app in Teams, whether in the browser or Teams App,

1. Create an [app manifest](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) for Teams. Here's a [sample manifest](TeamsAppPackage/manifest.json). Note that for this sample you don't need the last section [webApplicationInfo](TeamsAppPackage/manifest.json#L49), delete it.
2. Ensure your react.js app is running locally, for example, with `npm start`.
3. Zip up [the manifest package](TeamsAppPackage/) and [upload to Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/create-personal-tab?pivots=node-java-script#upload-your-application-to-teams).
4. Go to the Teams Tab for your app. Click on `Get Mail`. You'll be prompted to log in for the first time you started Teams, even though you already logged into Teams.
5. Navigate away to another tab and navigate back. You'll click on `Get Mail` again. This time an auth dialog will pop up, but it will disappear without you having to enter credentials.

This is the experience when a single-page-app is not integrated in [Teams' notion of SSO](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview).
 In the [next sample](../GetMailWebTabSSO/), we will demonstrate how to enable SSO.
