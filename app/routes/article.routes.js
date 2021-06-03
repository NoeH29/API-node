const express = require('express');
const Router = express.Router();

const controller = require("../controllers/article.controller");

  // Create a new Article
  Router.post("/add", controller.create);

  // Retrieve all Articles
  Router.get("/articles", controller.findAll);

  // Retrieve all published Articles
  Router.get("/published", controller.findAllPublished);

  // Retrieve a single Article with id
  Router.get("/:id", controller.findOne);

  // Update a Article with id
  Router.put("/:id", controller.update);

  // Delete a Article with id
  Router.delete("/:id", controller.delete);

  // Create a new Article
  Router.delete("/", controller.deleteAll);

  module.exports = Router;

