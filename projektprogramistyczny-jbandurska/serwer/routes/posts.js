const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Pobierz jeden post
router.get("/:id", cors(), async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });

    res.json(post);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Pobierz wszystkie posty użytkownika
router.get("/all/:username", cors(), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const id = user.id;

    const posts = (await Post.find({ userId: id })).reverse();

    res.json({ posts });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Pobierz posty followów z 3 ostatnich dni
router.get("/homepage/:username", cors(), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const followed = user.following;

    const posts = await Post.find({
      userId: { $in: followed },
      date: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
    }).sort({
      date: -1,
    });

    res.json({ posts });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Pobierz komentarze
router.get("/comments/:id", cors(), async (req, res) => {
  try {
    const comments = (
      await Post.aggregate([
        { $match: { id: req.params.id } },
        { $project: { _id: 0, comments: 1 } },
      ])
    )[0].comments;

    const ids = comments.map((comment) => comment.userId);

    // Zamieniamy userIDs na aktualne nazwy użytkownika
    const usernames = await User.aggregate([
      { $match: { id: { $in: ids } } },
      { $project: { _id: 0, id: 1, username: 1 } },
    ]);

    const usernamesObject = usernames.reduce((prev, curr) => {
      return { ...prev, [curr.id]: curr.username };
    }, {});

    const commentsWithUsernames = comments.map((comment) => ({
      content: comment.content,
      username: usernamesObject[comment.userId],
      id: comment.id,
    }));

    res.json({ comments: commentsWithUsernames });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Wstaw nowy post
router.post("/", [cors(), upload.single("file")], async (req, res) => {
  const imageData = fs.readFileSync(req.file.path);
  const base64Image =
    "data:image/png;base64," +
    Buffer.from(imageData, "binary").toString("base64");

  // Delete the uploaded file
  fs.unlinkSync(req.file.path);

  const post = new Post({
    userId: req.body.userId,
    description: req.body.description,
    picture: base64Image,
  });

  try {
    const newPost = await post.save();

    await User.updateOne(
      { id: req.body.userId },
      { $push: { posts: newPost.id } }
    );

    res.send(newPost);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Zamieść komentarz
router.post("/comments/:id", cors(), async (req, res) => {
  try {
    await Post.updateOne(
      { id: req.params.id },
      {
        $push: {
          comments: {
            userId: req.body.userId,
            content: req.body.content,
            id: uuidv4(),
          },
        },
      }
    );

    res.json({ message: "Comment posted" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Edytuj post
router.patch("/:id", cors(), async (req, res) => {
  try {
    await Post.updateOne(
      { id: req.params.id },
      { description: req.body.description }
    );

    res.json({ description: req.body.description });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Polub post
router.patch("/like/:id", cors(), async (req, res) => {
  try {
    if (req.body.type === "like") {
      await Post.updateOne({ id: req.params.id }, { $inc: { likes: 1 } });

      await User.updateOne(
        {
          id: req.body.userId,
        },
        {
          $push: { likedPosts: req.params.id },
        }
      );

      res.json({ message: "Post liked" });
    } else {
      await Post.updateOne({ id: req.params.id }, { $inc: { likes: -1 } });

      await User.updateOne(
        {
          id: req.body.userId,
        },
        {
          $pull: { likedPosts: req.params.id },
        }
      );

      res.json({ message: "Post unliked" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Usuń post
router.delete("/:id", cors(), async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });

    await User.updateOne(
      { id: post.userId },
      { $pull: { posts: { $in: [req.params.id] } } }
    );

    await post.remove();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Usuń komentarz
router.delete("/comments/:id", cors(), async (req, res) => {
  try {
    const response = await Post.updateOne(
      { id: req.params.id },
      {
        $pull: {
          comments: { id: req.query.commentId },
        },
      }
    );

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
