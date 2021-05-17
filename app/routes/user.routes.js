const express = require('express');
const Router = express.Router();

const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/user.controller");

    Router.get("/all", controller.allAccess);

    Router.get("/user", [authJwt.verifyToken], controller.userBoard);

    Router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);


module.exports = Router