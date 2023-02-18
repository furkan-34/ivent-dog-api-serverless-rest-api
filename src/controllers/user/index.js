const { 
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} = require("@aws-sdk/client-cognito-identity-provider");

const express = require("express");
const user = require("express").Router();



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

const signUpUser = async (req, res) => {
  const { email, name, password, lastname } = req.body;

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

  try {
    await cognitoClient.send(adminCreateUserCommand)
    await cognitoClient.send(adminSetUserPasswordCommand)
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  return res.status(201).json({ message: `${email} is registered successfully!` });
}


module.exports = {
  signUpUser,
  listUsers
}
