const express = require("express");
const router = express.Router();
const User = require("../models/user");
const cors = require("cors");

// Pobierz feed
router.get("/:userId", cors(), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId }, {feed: 1});
    res.json({feed: user.feed});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj do feedu
router.patch("/:userId", cors(), async (req, res) => {
  try {
    await User.updateOne(
      { id: req.params.userId },
      { $push: { feed: {$each: [req.body], $slice: -20} } }
    );
      
    res.json({ message: "Feed updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
