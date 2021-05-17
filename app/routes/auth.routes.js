const express = require('express');
const Router = express.Router();

const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");


    Router.post(
        "/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    Router.post("/signin", controller.signin);

module.exports = Router;