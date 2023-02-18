const { 
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminSetUserPasswordCommand
  } = require("@aws-sdk/client-cognito-identity-provider");

const signUpUser = async (event, context)=> {
   
    const { email, name, password, lastname } = JSON.parse(event.body);

    const cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.SERVICE_REGION
    })
    const adminCreateUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.USER_POOL,
      Username: email,
      UserAttributes: [
        {
          Name: "name",
          Value: name
        },
        {
          Name: "family_name",
          Value: lastname
        }
      ]
    })
    const adminSetUserPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.USER_POOL,
      Username: email,
      Password: password,
      Permanent: true
    })

    let response = {
        statusCode: 200,
        body: JSON.stringify({ message: `${email} is registered successfully!` })
    };

    try {
      await cognitoClient.send(adminCreateUserCommand)
      await cognitoClient.send(adminSetUserPasswordCommand)
    } catch (error) {
        console.log(process.env.USER_POOL)
        response.body = JSON.stringify({ error: error })
    }
  
    return response
}


module.exports = {
    signUpUser
}