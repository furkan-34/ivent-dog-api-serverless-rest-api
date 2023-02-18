const express = require("express");
const serverless = require("serverless-http");
const { listBreeds, listImages, addToFavorites, deleteFromFavorites, listFavorites } = require("./src/controllers/dog");
const { signUpUser, listUsers } = require("./src/controllers/user");

const app = express();
app.use(express.json());


app.get("/users", async function (req, res) {
  
  return listUsers(req, res)
});

app.post("/users/signup", async function (req, res) {

  return signUpUser(req, res)
});


app.get("/dogs/breeds", async function (req, res) {

  return listBreeds(req, res)
});

app.get("/dogs/images", async function (req, res) {

  return listImages(req, res)
});

app.get("/dogs/favorites", async function (req, res) {

  return listFavorites(req, res)
});

app.post("/dogs/favorites", async function (req, res) {

  return addToFavorites(req, res)
});

app.delete("/dogs/favorites/:identifier", async function (req, res) {

  return deleteFromFavorites(req, res)
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found Service",
  });
});


module.exports.handler = serverless(app);
