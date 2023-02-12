const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

/**
 * Validates the access token for signature 
 * and against a predefined set of claims
 */
validateAccessToken = async(accessToken) => {
    
    if (!accessToken || accessToken === "" || accessToken === "undefined") {
        console.error('No tokens found');
        return false;
    }

    // we will first decode to get kid parameter in header
    let decodedToken; 
    
    try {
        decodedToken = jwt.decode(accessToken, {complete: true});
    } catch (error) {
        console.error('Token cannot be decoded:', error);
        return false;
    }

    // obtains signing keys from discovery endpoint
    let keys;

    try {
        keys = await getSigningKeys(decodedToken.header, decodedToken.payload.tid);        
    } catch (error) {
        console.error('Signing keys cannot be obtained:', error);
        return false;
    }

    // verify the signature at header section using keys
    let verifiedToken;

    try {
        verifiedToken = jwt.verify(accessToken, keys);
    } catch(error) {
        console.error('Token cannot be verified:', error);
        return false;
    }

    /**
     * Validates the token against issuer, audience, scope
     * and timestamp, though implementation and extent vary. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
     */

    const now = Math.round((new Date()).getTime() / 1000); // in UNIX format

    const checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
    const checkAudience = verifiedToken['aud'] === process.env.CLIENT_ID || verifiedToken['aud'] === 'api://' + process.env.CLIENT_ID ? true : false;
    const checkScope = verifiedToken['scp'] === process.env.EXPECTED_SCOPES ? true : false;
    console.log(`check result ${checkTimestamp}, ${checkAudience}, ${checkScope}`);

    return (checkTimestamp && checkAudience && checkScope);
};

/**
 * Fetches signing keys of an access token 
 * from the authority discovery endpoint
 */
getSigningKeys = async(header, tid) => {

    // discovery keys endpoint will be specific to your tenant
    const jwksUri =`https://login.microsoftonline.com/${tid}/discovery/v2.0/keys`

    const client = jwksClient({
        jwksUri: jwksUri
    });

    return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
};

module.exports = validateAccessToken