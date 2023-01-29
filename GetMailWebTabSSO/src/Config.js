import { BrowserCacheLocation } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_APP_REGISTRATION_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_INFO}`,
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URL,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage
  }
};
