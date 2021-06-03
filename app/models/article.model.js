module.exports = mongoose => {
  
    var schema = mongoose.Schema(
      {
        title: String,
        description: String,
        imageUrl: String,
        comments: String,
        price: Number,
        total_vendu: Number,
        catégorie: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Article = mongoose.model("article", schema);
    return Article;
  };
