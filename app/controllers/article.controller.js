const db = require("../models");
const Article = db.article;

exports.createArticle = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    console.log(req.body);
    // Create a Article
    const article = new Article({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        total_vendu: req.body.total_vendu,
        catégorie: req.body.catégorie,
        comments: req.body.comments,
        description: req.body.description,

    });

    // Save article in the database
    article
        .save(article)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Article."
            });
        });
};


exports.updateArticle = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Article with id=${id}. Maybe Article was not found!`
                });
            } else res.send({ message: "Article was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Article with id=" + id
            });
        });
};

exports.deleteArticle = (req, res) => {
    const id = req.params.id;

    Article.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
                });
            } else {
                res.send({
                    message: "Article was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Article with id=" + id
            });
        });
};