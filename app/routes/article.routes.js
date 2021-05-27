const express = require('express');
const Router = express.Router();

const controller = require("../controllers/article.controller");

Router.post("/register", controller.createArticle);
Router.put("/:id", controller.updateArticle);
Router.delete("/:id", controller.deleteArticle);

module.exports = Router;