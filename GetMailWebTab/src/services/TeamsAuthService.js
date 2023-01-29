// TeamsAuthService is a singleton so it can retain the user's
// state independent of React state. This module exports the single
// instance of the service rather than the service class; just use it,

// don't new it up.
class TeamsAuthService {
    constructor() {
        this.authState = {
            username: null,
            accessToken: null,
            expiresOn: Date.now()
        }
    }

    isLoggedIn() {
        return Date.now() < this.authState.expiresOn;
    }

    getUsername() {
        return this.authState.username;
    }

    // When calling from Teams (iFrame), login redirect isn't supported because the host app could put a div on top of the login button
    // and redirect the user to a malicious site (clickjacking), do a popup instead.
    async getAccessToken(scopes, microsoftTeams) {
        microsoftTeams.initialize();
        const urlParams = scopes ? "?scopes=" + scopes.toString() : ""
        const p = new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/#teamsauthpopup" + urlParams,
                width: 600,
                height: 535,
                successCallback: (response) => {
                    const { username, accessToken, expiresOn } =
                        JSON.parse(response);
                    this.authState = { username, accessToken, expiresOn };
                    resolve({ username, accessToken, expiresOn });
                },
                failureCallback: (reason) => {
                    reject(reason);
                }
            });
        });
        const result = await p;
        return result;
    }
}

export default new TeamsAuthService();