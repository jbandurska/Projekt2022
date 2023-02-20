const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const cors = require("cors");

// Pobierz historię wiadomości
router.get("/:chatId", cors(), async (req, res) => {
  try {
    const messagesHistory = (
      await Chat.aggregate([
        { $match: { id: req.params.chatId } },
        { $project: { _id: 0, messagesHistory: 1 } },
      ])
    )[0].messagesHistory;

    res.json({ messagesHistory });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Pobierz wszystkie czaty użytkownika
router.get("/all/:userId", cors(), async (req, res) => {
  try {
    const regex = req.params.userId;
    const chats = await Chat.aggregate([
      { $match: { id: new RegExp(regex, "i") } },
      { $project: { _id: 0, id: 1, date: 1 } },
      { $sort: { date: -1 } },
    ]);

    res.json({ chats });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Zapisz wiadomość w historii
router.post("/", cors(), async (req, res) => {
  try {
    const result = await Chat.updateOne(
      { id: req.body.chatId },
      {
        $push: {
          messagesHistory: {
            userId: req.body.userId,
            content: req.body.content,
          },
        },
        date: Date.now(),
      },
      {
        upsert: true,
      }
    );

    res.json({ message: "Message saved", upserted: result.upsertedCount });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
