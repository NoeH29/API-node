const db = require("../models");
require('dotenv').config();
const _ = require('lodash');
const User = db.user;
const Role = db.role;
const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: process.env.DOMAIN });


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        let token = jwt.sign({ username, email, password }, process.env.SECRET, {
            expiresIn: '20m' // 24 hours
        });

        const data = {
            from: "noreply@hello.com",
            to: email,
            subject: "Account Activation Link",
            html: `
                <h2>please click on given link to activate your account</h2>
                <p>${process.env.CLIENT_URL}/email-activate/${token}<p>
                `
        };
        mg.messages().send(data, function (error, body) {
            if (error) {
                return res.json({ error: err.message, })
            }
            return res.json({ message: 'Un Email a été envoyer pour activer votre compte' });
        });
    });
}


exports.activateAccount = (req, res) => {

    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: "Incorrect or Expired link." });
            }
            const { email, password, username } = decodedToken;
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    return res.status(400).json({ error: "User with this email already exists." });
                }
            });
            let newUser = new User({ username, email, password });
            newUser.save((err, newUser) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (req.body.roles) {
                    Role.find(
                        {
                            name: { $in: req.body.roles }
                        },
                        (err, roles) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            newUser.roles = roles.map(role => role.id);
                            newUser.save(err => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }

                                res.send({ message: "User was registered successfully!" });
                            });
                        }
                    );
                } else {
                    Role.findOne({ name: "user" }, (err, role) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        newUser.roles = [role.id];
                        newUser.save(err => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            res.send({ message: "User was registered successfully!" });
                        });
                    });
                }
            });
        });
    } else {
        return res.json({ error: "Something went wrong!!!" });
    }
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err,
                });
                return;
            }

            if (!user) {
                return res.status(404).send({
                    message: "User Not found.",
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }

            var token = jwt.sign(
                {
                    id: user.id,
                },
                process.env.SECRET,
                {
                    expiresIn: 86400, // 24 hours
                }
            );

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
            });
        });
};


exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with this email already exists." });
        }
        let token = jwt.sign({ id: user.id }, process.env.RESETPSW, {
            expiresIn: 86400 // 24 hours
        });

        const data = {
            from: "noreply@hello.com",
            to: email,
            subject: "Reset password Link",
            html: `
                <h2>please click on given link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset-password/${token}<p>
                `
        };

        return user.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "reset password link error" });
            } else {
                mg.messages().send(data, function (error, body) {
                    if (error) {
                        return res.json({ error: err.message })
                    }
                    return res.json({ message: 'Email a été envoyer , suivez les instructions' });
                });
            }
        })
    });
};

exports.resetPassword = (req, res) => {
    const { resetLink, newPassword } = req.body;
    if (resetLink) {
        jwt.verify(resetLink, process.env.RESETPSW, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired !"
                })
            }
            User.findOne({ resetLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: "User with this token does not exists." });
                }
                const obj = {
                    password: newPassword,
                    resetLink: ''
                }
                user = _.extend(user, obj);
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({ error: "reset password error" });
                    } else {
                        return res.status(200).json({ message: 'Ton password a été changer' });
                    }
                })
            })
        })
    } else {
        return res.status(400).json({ error: "Authentification error!" });
    }
};
