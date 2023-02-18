const { CognitoJwtVerifier } = require("aws-jwt-verify")

const authMiddleware = async (event, context) => {
  let authFail = false

  if (!event.headers.authorization || !event.headers.authorization.startsWith("Bearer")) authFail = true
      
  const authorization = event.headers.authorization;  
  const access_token = authorization.split(" ")[1];
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL,
    tokenUse: "access",
    clientId: process.env.USER_CLIENT,
  });

  if (!access_token) authFail = true

  try {
    await verifier.verify(access_token);
  } catch (error) {
    authFail = false
  } 

  if (authFail) {
    context.end();
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }
};

module.exports = {
  authMiddleware
}