const { CognitoJwtVerifier } = require("aws-jwt-verify")

const decodeToken = async (authorization) => {
    const id_token = authorization.split(" ")[1];
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL,
        tokenUse: "id",
        clientId: process.env.USER_CLIENT,
    })

    try {
        return await verifier.verify(id_token)
    } catch (error) {
        console.log("AUTH ERROR! " + error)
        return false
    }
}

module.exports = {
    decodeToken
}