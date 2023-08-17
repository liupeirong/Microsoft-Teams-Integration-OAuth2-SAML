import { BrowserCacheLocation } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_APP_REGISTRATION_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_INFO}`,
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URL,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  }
};