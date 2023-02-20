const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    collection: "posts",
  }
);

module.exports = mongoose.model("Post", postSchema);
