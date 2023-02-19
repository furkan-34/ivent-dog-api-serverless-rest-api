const { 
  CognitoIdentityProviderClient,
  ListUsersCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const { decodeToken } = require("../../helpers/jwt");


const listUsers = async (req, res) => {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.SERVICE_REGION
  })
  const listUsersCommand = new ListUsersCommand({
    UserPoolId: process.env.USER_POOL
  })
  
  const response = await cognitoClient.send(listUsersCommand)
  return res.status(200).json({ users: response.Users });
}

const getUserMe = async (req, res) => {
  const { authorization } = req.headers
  
  const payload = await decodeToken(authorization)
  
  return res.status(200).json({ user: payload });
}


module.exports = {
  listUsers,
  getUserMe
}
