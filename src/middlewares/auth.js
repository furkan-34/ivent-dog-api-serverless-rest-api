const { decodeToken } = require("../helpers/jwt");

const authMiddleware = async (event, context) => {
  let authFail = false

  if (!event.headers.authorization || !event.headers.authorization.startsWith("Bearer")) authFail = true
      
  const authorization = event.headers.authorization;  
  const access_token = authorization.split(" ")[1];
  if (!access_token) authFail = true

  try {
    var checkToken = await decodeToken(authorization)
  } catch (error) {
    authFail = false
  } 

  if (authFail || !checkToken) {
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