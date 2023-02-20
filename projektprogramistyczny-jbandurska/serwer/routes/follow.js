const express = require("express");
const router = express.Router();
const User = require("../models/user");
const cors = require("cors");

// Pobierz followersów
router.get("/", cors(), async (req, res) => {
  try {
    const users = await User.find({ id: { $in: req.query.ids } });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Zaobserwuj kogoś
router.patch("/:idToFollow", cors(), async (req, res) => {
  try {
    await User.updateOne(
      { id: req.body.userId },
      { $push: { following: req.params.idToFollow } }
    );
    await User.updateOne(
      { id: req.params.idToFollow },
      { $push: { followers: req.body.userId } }
    );
    res.json({ message: "Follow successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Wyślij prośbę o obserwację
router.patch("/request/:yourId", cors(), async (req, res) => {
  try {
    await User.updateOne(
      { id: req.params.yourId },
      { $push: { requests: req.body.userId } },
      { upsert: true }
    );
    res.json({ message: "Follow request successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Usuń prośbę o obserwację
router.delete("/request/:yourId", cors(), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.yourId },
      { $pull: { requests: req.query.userId } },
      { projection: { _id: 0, requests: 1 } }
    );

    const updatedRequests = user.requests.filter(
      (id) => id !== req.query.userId
    );

    res.json({ requests: updatedRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Odzaobserwuj kogoś
router.delete("/:idToUnfollow", cors(), async (req, res) => {
  try {
    await User.updateOne(
      { id: req.query.userId },
      { $pull: { following: { $in: [req.params.idToUnfollow] } } }
    );

    await User.updateOne(
      { id: req.params.idToUnfollow },
      { $pull: { followers: { $in: [req.query.userId] } } }
    );
    res.json({ message: "Follow successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
