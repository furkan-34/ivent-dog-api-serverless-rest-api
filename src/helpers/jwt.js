const { CognitoJwtVerifier } = require("aws-jwt-verify")

const decodeToken = async (authorization) => {
    const access_token = authorization.split(" ")[1];
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL,
        tokenUse: "access",
        clientId: process.env.USER_CLIENT,
    })
    
    try {
        return await verifier.verify(access_token)
    } catch (error) {
        return false
    }
}

module.exports = {
    decodeToken
}