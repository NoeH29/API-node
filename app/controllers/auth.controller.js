const config = require("../config/auth.config");
const db = require("../models");
const _ = require('lodash');
const User = db.user;
const Role = db.role;
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox8d12f66f889647d7ab7e7f24cce73675.mailgun.org";
const MAILGUN_APIKEY = "5e642754bdc7de45463c35c426eb4442-6ae2ecad-8ac905db";
const mg = mailgun({ apiKey: MAILGUN_APIKEY, domain: DOMAIN });
const CLIENT_URL = "http://localhost:8080/#";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.satus(400).json({ error: "User with this email already exists." });
        }

        let token = jwt.sign({ username, email, password }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        const data = {
            from: "noreply@hello.com",
            to: email,
            subject: "Account Activation Link",
            html: `
                <h2>please click on given link to reset your password</h2>
                <p>${CLIENT_URL}/email-activate/${token}<p>
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
        jwt.verify(token, config.secret, function (err, decodedToken) {
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
                config.secret,
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
            return res.satus(400).json({ error: "User with this email already exists." });
        }
        let token = jwt.sign({ id: user.id }, config.resetpsw, {
            expiresIn: 86400 // 24 hours
        });

        const data = {
            from: "noreply@hello.com",
            to: email,
            subject: "Reset password Link",
            html: `
                <h2>please click on given link to reset your password</h2>
                <p>${CLIENT_URL}/resetpassword/${token}<p>
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
    const { resetLink, newpassword } = req.body;
    if (resetLink) {
        jwt.verify(resetLink, config.resetpsw, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired !"
                })
            }
            User.findOne({ resetLink }, (err, user) => {
                if (err || !user) {
                    return res.satus(400).json({ error: "User with this token does not exists." });
                }
                const obj = {
                    password: newpassword,
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
        return res.satus(400).json({ error: "Authentification error!" });
    }
};
