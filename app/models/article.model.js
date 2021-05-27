
module.exports = mongoose => {
    const Article = mongoose.model(
        "article",
        mongoose.Schema(
            {
                title: String,
                description: String,
                imageUrl: String,
                price: Number,
                total_vendu: Number,
                comments: String,
                catégorie: String,
            },
            { timestamps: true }
        )
    );

    return Article;
};