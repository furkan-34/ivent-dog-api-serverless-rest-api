const express = require("express");
const { DynamoDBClient, PutItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const axios = require("axios");
const { unixTimestamp } = require("../../helpers/timestamp");
const { v4: uuidv4 } = require('uuid');
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { decodeToken } = require("../../helpers/jwt");

const app = express();
app.use(express.json());

const listBreeds = async (req, res) => {
  const apiResponse = await axios.get(process.env.DOG_API + "/breeds/list/all")
  const breeds = Object.keys(apiResponse.data.message)

  return res.status(200).json({ breeds: breeds });
}

const listImages = async (req, res) => {
  const { search } = req.query

  const breedResponse = await axios.get(process.env.DOG_API + "/breeds/list/all")
  const breeds = Object.keys(breedResponse.data.message)

  if (search) {
    if (!breeds.includes(search)) res.status(400).json({ error: "Bad Request for search param." })

    try {
      const apiResponse = await axios.get(process.env.DOG_API + `/breed/${search}/images`)
      return res.status(200).json({ images: apiResponse.data.message })
    } catch (error) {
      return res.status(400).json({ error: "Bad Request" })
    }
  }

  const imagePromises = []
  let images = []
  breeds.forEach(breed => imagePromises.push(axios.get(process.env.DOG_API + `/breed/${breed}/images`)))

  let promiseResults = await Promise.all(imagePromises)
  for (const promiseResult of promiseResults) {
    images = images.concat(promiseResult.data.message)
  }
  
  return res.status(200).json({ images: images })
}

const addToFavorites = async (req, res) => {
  const { image } = req.body
  const { authorization } = req.headers
  
  const payload = await decodeToken(authorization)

  const dynamoDBClient = new DynamoDBClient({
    region: process.env.SERVICE_REGION
  })
  const putItemCommand = new PutItemCommand({
    TableName: process.env.DogsTable,
    Item: {
      identifier: { S: `${uuidv4()}` },
      image: { S: `${image}` },
      username: { S: `${payload.username}` },
      timestamp: { N: `${unixTimestamp()}` },
    },
  })

  try {
    await dynamoDBClient.send(putItemCommand)
    return res.status(201).json({ message: `Image is favorited successfully!`});
  } catch (error) {
    return res.status(500).json({ error: error});
  }
}

const deleteFromFavorites = async (req, res) => {
  
  const { identifier } = req.params
  const { authorization } = req.headers
  
  const payload = await decodeToken(authorization)
  
  const dynamoDBClient = new DynamoDBClient({
    region: process.env.SERVICE_REGION
  })

  const scanCommand  = new ScanCommand({
    TableName: process.env.DogsTable,
    FilterExpression: "identifier = :identifier and username = :username",
    ExpressionAttributeValues: {
      ":identifier": { "S": `${identifier}` },
      ":username": { "S": `${payload.username}` }
    },
    Limit: 1
  })

 try {
  const scanResponse = await dynamoDBClient.send(scanCommand)
  const item = unmarshall(scanResponse.Items[0])
  if (!item) return res.status(404).json({ message: "Item Not Exists."});
  const deleteItemCommand = new DeleteItemCommand({
    TableName: process.env.DogsTable,
    Key: {
      identifier: { S: `${identifier}` },
      timestamp: { N: `${item.timestamp}` },
    }
  })

  await dynamoDBClient.send(deleteItemCommand)
  return res.status(200).json({ message: `Image is deleted from favorites successfully!`});
 } catch (error) {
  return res.status(500).json({ error: error});
 }
}

const listFavorites = async (req, res) => {

  const { authorization } = req.headers
  const payload = await decodeToken(authorization)

  const dynamoDBClient = new DynamoDBClient({
    region: process.env.SERVICE_REGION
  })
  const scanCommand  = new ScanCommand({
    TableName: process.env.DogsTable,
    FilterExpression: "username = :username",
    ExpressionAttributeValues: {
        ":username": { "S": `${payload.username}` }
    }
  })

  try {
    const response = await dynamoDBClient.send(scanCommand)
    const items = response.Items.map(item => unmarshall(item))

    return res.status(200).json({ favorites: items});
  } catch (error) {
    return res.status(500).json({ error: error});
  }
}

module.exports = {
  listBreeds,
  listImages,
  addToFavorites,
  deleteFromFavorites,
  listFavorites
}
