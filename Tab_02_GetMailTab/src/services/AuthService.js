import * as msal from '@azure/msal-browser';
import * as Config from '../Config';

// AuthService is a singleton so one PublicClientApplication
// can retain state. This module exports the single instance
// of the service rather than the service class; just use it,
// don't new it up.
class AuthService {

    constructor() {

        // MSAL request object to use over and over
        this.request = { scopes: ["user.read"] }

        // Keep this MSAL client around to manage state across SPA "pages"
        this.msalClient = new msal.PublicClientApplication(Config.msalConfig);
    }

    async init() {
        console.log("authService init");
        let response = await this.msalClient.handleRedirectPromise();
        if (response?.account?.username) {
            console.log("redirect got user name:", response.account.username);
            return true;
        } else {
            const accounts = this.msalClient.getAllAccounts();
            if (accounts === null || accounts.length === 0) {
                console.log("no account found");
                return false;
            } else if (accounts.length > 1) {
                throw new Error("ERROR: Multiple accounts are logged in");
            } else if (accounts.length === 1) {
                console.log("one account user name:", accounts[0].username);
                return true;
            }
        }
    }

    isLoggedIn() {
        const accounts = this.msalClient.getAllAccounts();
        return (accounts?.length === 1);
    }

    getUsername() {
        const accounts = this.msalClient.getAllAccounts();
        let result = null;

        if (accounts?.length === 1) {
            result = accounts[0].username;
        } else if (accounts?.length > 1) {
            console.log('ERROR: Multiple users logged in');
        }
        return result;
    }

    // Call this to log the user in
    login(scopes) {
        if (scopes) {
            this.request.scopes = scopes;
        }
        try {
            // Note this is not possible without popup because of clickjacking
            this.msalClient.loginRedirect(this.request);
        }
        catch (err) {
            console.error(err);
        }
    }

    // Call this to get the access token
    async getAccessToken(scopes) {
        this.request.account =
            this.msalClient.getAccountByUsername(this.getUsername());
        if (scopes) {
            this.request.scopes = scopes;
        }
        try {
            const resp = await this.msalClient.acquireTokenSilent(this.request);
            if (resp?.accessToken) {
                return {
                    username: this.getUsername(),
                    accessToken: resp.accessToken,
                    expiresOn: (new Date(resp.expiresOn)).getTime()
                };
            } else {
                return null;
            }
        }
        catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                console.warn("Silent token acquisition failed; acquiring token using redirect");
                this.msalClient.acquireTokenRedirect(this.request);
            } else {
                throw (error);
            }
        }
    }

    // Call this to get the id token
    getIDToken() {
        console.log("request:", this.request)
        this.request.account =
            this.msalClient.getAccountByUsername(this.getUsername());
        console.log("auth request:", this.request)
        if (this.request?.account?.idToken) {
            return {
                username: this.getUsername(),
                accessToken: this.request.account.idToken,
                expiresOn: null,
            };
        } else {
            return null;
        }
    }
}

export default new AuthService();