const express = require('express');
const Router = express.Router();

const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");

Router.post("/signup", controller.signup)
Router.post('/email-activate', controller.activateAccount)
Router.post("/signin", controller.signin);


module.exports = Router;