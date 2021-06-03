const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.article = require("./article.model.js")(mongoose);

db.ROLES = ["user", "admin"];

module.exports = db;