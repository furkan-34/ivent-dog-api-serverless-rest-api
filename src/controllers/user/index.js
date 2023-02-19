const { 
  CognitoIdentityProviderClient,
  ListUsersCommand
} = require("@aws-sdk/client-cognito-identity-provider");


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


module.exports = {
  listUsers
}
