const express = require('express');
const msal = require('@azure/msal-node');
const validateAccessToken = require('./validator');
const app = express();
const msGraphClient = require("@microsoft/microsoft-graph-client");

require('dotenv').config();

// Before running the sample, you will need to replace the values in the .env file, 
const config = {
    auth: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_INFO}`,
    }
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

app.get('/getGraphAccessToken', async (req, res) => {

    // the access token the user sent via auth bearer
    const userToken = req.get('authorization');
    const [bearer, tokenValue] = userToken.split(' ');

    // Ensure that the token is valid
    if (validateAccessToken(tokenValue)) {

        const oboRequest = {
            oboAssertion: tokenValue,
            scopes: [process.env.GRAPH_SCOPES],
        }

        try {
            let tokenResponse = await cca.acquireTokenOnBehalfOf(oboRequest);

            if (tokenResponse instanceof msal.InteractionRequiredAuthError) {
                /**
                 * Conditional access MFA requirement throws an AADSTS50076 error.
                 * If the user has not enrolled in MFA, an AADSTS50079 error will be thrown instead.
                 * If the user has not consented to required scopes, an AADSTS65001 error will be thrown instead.
                 * In either case, sample middle-tier API will propagate the error back to the client.
                 * For more, visit: https://docs.microsoft.com/azure/active-directory/develop/v2-conditional-access-dev-guide
                 */
                if (tokenResponse['errorMessage'].includes(50076) || tokenResponse['errorMessage'].includes(50079) || tokenResponse['errorMessage'].includes(65001)) {
                    console.log(`tokenRepsonse: ${tokenResponse}`);
                    return res.status(401).send(tokenResponse);
                }
            }

            const graphClient = msGraphClient.Client.init({
                authProvider: (done) => {
                    done(null, tokenResponse.accessToken);
                }
            });
            let resourceResponse = await getMessages(graphClient);
            console.log(`resource response: ${resourceResponse}`);
            return res.send(resourceResponse);
        } catch (error) {
            console.error(error)
            return res.send(error);
        }
    } else {
        return res.send("Invalid Token");
    }
});


async function getMessages(graphClient) {
    return await graphClient
        .api("me/mailFolders/inbox/messages")
        .select(["receivedDateTime", "subject"])
        .top(15)
        .get();
}

const port = process.env.PORT || 5000;

app.listen(port);

console.log('API server is listening on port ' + port);
