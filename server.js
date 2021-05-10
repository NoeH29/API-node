const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const router = express.Router();

var corsOptions = {
    origin: "http://localhost:8081",
};

router.use(cors(corsOptions));

// parse requests of content-type - application/json
router.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({
    extended: true
}));

const db = require("./app/models");
const Role = db.role;

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
router.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'application de Noé H."
    });
});

// routes
router.use("./app/routes/auth.routes");
router.use("./app/routes/user.routes");

// set port, listen for requests
const PORT = process.env.PORT || 8080;
router.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}