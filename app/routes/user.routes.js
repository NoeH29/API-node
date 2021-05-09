const {
    authJwt
} = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/api/test/all", controller.allAccess);

    router.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    router.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

};