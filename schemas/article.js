const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "users", required: true },
  tagList: String
});

module.exports = model("articles", ArticleSchema);
