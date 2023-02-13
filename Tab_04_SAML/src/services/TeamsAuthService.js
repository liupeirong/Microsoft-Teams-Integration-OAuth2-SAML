// TeamsAuthService is a singleton so it can retain the user's
// state independent of React state. This module exports the single
// instance of the service rather than the service class; just use it,

// don't new it up.
class TeamsAuthService {
    async login(microsoftTeams) {
        const p = new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/#teamsauthpopup",
                width: 600,
                height: 535,
                successCallback: (response) => {
                    resolve(response);
                },
                failureCallback: (reason) => {
                    alert('failed:' + reason);
                    reject(reason);
                }
            });
        });
        const result = await p;
        return result;
    }
}

export default new TeamsAuthService();