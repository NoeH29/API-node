const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const authRoutes = require('./app/routes/auth.routes.js');
const userRoutes = require('./app/routes/user.routes.js');
const articleRoutes = require('./app/routes/article.routes.js');
require('dotenv').config();
const path = __dirname + '/app/views/';
const app = express();

app.use(express.static(path));

var corsOptions = {
    origin: "http://localhost:8081",
};

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;


db.mongoose
    .connect(`mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB}`, {
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
app.get("/", (req, res) => {
    res.sendFile(path + "index.html");
});

// routes
app.use("/auth",authRoutes);
app.use("/user",userRoutes);
app.use("/api",articleRoutes);


// set port, listen for requests
const PORT = 8080;
app.listen(PORT, () => {
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
