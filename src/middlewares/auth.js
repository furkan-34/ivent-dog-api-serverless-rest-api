const { decodeToken } = require("../helpers/jwt");

const authMiddleware = async (event, context) => {
  let authFail = false

  if (!event.headers.authorization || !event.headers.authorization.startsWith("Bearer")) authFail = true
      
  const authorization = event.headers.authorization;  
  const id_token = authorization.split(" ")[1];
  if (!id_token) authFail = true

  try {
    var checkToken = await decodeToken(authorization)
  } catch (error) {
    authFail = false
  } 

  if (authFail || !checkToken) {
    context.end();
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }
};

module.exports = {
  authMiddleware
}