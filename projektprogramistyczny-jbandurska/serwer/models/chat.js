const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    messagesHistory: {
      type: Array,
      required: true,
      default: [],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "chats",
  }
);

module.exports = mongoose.model("Chat", chatSchema);
