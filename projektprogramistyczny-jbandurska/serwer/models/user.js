const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  numberOrEmail: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
    default:
      "https://i.pinimg.com/474x/a7/e7/0f/a7e70f694c71eb52be215bb06e882116.jpg",
  },
  description: {
    type: String,
    default: "",
  },
  following: {
    type: Array,
    required: true,
    default: [],
  },
  followers: {
    type: Array,
    required: true,
    default: [],
  },
  id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  posts: {
    type: Array,
    required: true,
    default: [],
  },
  likedPosts: {
    type: Array,
    required: true,
    default: [],
  },
  feed: {
    type: Array,
    required: true,
    default: [],
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  requests: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
