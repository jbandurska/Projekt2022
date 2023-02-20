const express = require("express");
const router = express.Router();
const User = require("../models/user");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// Getting all with key
router.get("/key/:key", cors(), async (req, res) => {
  const regex = `${req.params.key}`;
  try {
    const users = await User.find(
      {
        $or: [
          { username: new RegExp(regex, "i") },
          { fullname: new RegExp(regex, "i") },
        ],
      },
      { _id: 0, password: 0 }
    ).limit(9);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one for info
router.get("/:username", [cors(), getUserByUsername], (req, res) => {
  if (res.user == null) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(res.user);
});

// Getting one for info by id
router.get("/id/:userId", cors(), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId }, { password: 0 });
    res.json({ user });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Getting one to log in
router.get("/login/:login", cors(), async (req, res) => {
  try {
    const userWithPassword = await User.findOne(
      {
        $or: [
          {
            username: req.params.login,
          },
          {
            numberOrEmail: req.params.login,
          },
        ],
      },
      { _id: 0 }
    );
    if (
      userWithPassword &&
      (await verifyPassword(req.query.password, userWithPassword.password))
    ) {
      const { password, ...user } = userWithPassword._doc;
      res.json(user);
    } else {
      res.json({ message: "Incorrect login and/or password." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", [cors(), getUserByUsername], async (req, res) => {
  let msg = "";
  if (res.user != null)
    msg += "The username is already taken. Please choose another one.";
  if ((await User.findOne({ numberOrEmail: req.body.numberOrEmail })) != null)
    msg += "An account with such email/phone number already exists.";
  if (msg == "") {
    const user = new User({
      ...req.body,
      username: req.body.username.toLowerCase(),
      password: await hashPassword(req.body.password),
    });

    try {
      const newUser = await user.save();

      // log do pliku
      fs.appendFileSync(
        "./logFile.txt",
        `${new Date().toDateString()} -> ${user.username} utworzył konto.\n`
      );

      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.json({ message: msg });
  }
});

// Updating one
router.put(
  "/:username",
  [cors(), getUserWithPasswordByUsername],
  async (req, res) => {
    // Jeśli user istnieje
    if (res.user != null) {
      let msg = "";

      // Jeśli username jest zajęty
      if (
        req.body.username != res.user.username &&
        (await User.findOne({ username: req.body.username })) != null
      )
        msg += " The username is already taken. Please choose another one. ";

      // Jeśli numberOrEmail jest zajęty
      if (
        req.body.numberOrEmail != res.user.numberOrEmail &&
        (await User.findOne({ numberOrEmail: req.body.numberOrEmail })) != null
      )
        msg += " An account with such email/phone number already exists.";

      // Jeśli są jakieś ale
      if (msg != "") {
        res.send({ message: msg });
      }

      // Jeśli nie ma ale
      else {
        // Sprawdzamy każde pole czy istnieje i podmieniamy jego wartość
        // Dzięki temu jedną funkcją można zmienić i hasło i informacje o koncie
        if (req.body.username != null) {
          res.user.username = req.body.username;
        }
        if (req.body.profilePicture) {
          res.user.profilePicture = req.body.profilePicture;
        }
        if (req.body.fullname != null) {
          res.user.fullname = req.body.fullname;
        }
        if (req.body.description != null) {
          res.user.description = req.body.description;
        }
        if (req.body.numberOrEmail != null) {
          res.user.numberOrEmail = req.body.numberOrEmail;
        }
        if (req.body.private != null) {
          res.user.private = req.body.private;
        }

        // Teraz możemy zapisać w bazie danych i odesłać użytkownika bez hasła
        const updatedUser = await res.user.save();
        const { password, ...updatedUserNoPassword } = updatedUser._doc;
        res.json({
          ...updatedUserNoPassword,
          message: "Account updated successfully",
        });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

// Updating password
router.put(
  "/password/:username",
  [cors(), getUserWithPasswordByUsername],
  async (req, res) => {
    if (!(await verifyPassword(req.body.oldPassword, res.user.password))) {
      res.json({ message: "The old password is incorrect. Please try again." });
    } else {
      res.user.password = await hashPassword(req.body.newPassword);
      await res.user.save();
      res.json({ message: "Password updated successfully!" });
    }
  }
);

//
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Update picture
router.put(
  "/picture/:username",
  [cors(), upload.single("file")],
  async (req, res) => {
    // Read the image data from the request
    const imageData = fs.readFileSync(req.file.path);

    // Convert the image data to base64
    const base64Image =
      "data:image/png;base64," +
      Buffer.from(imageData, "binary").toString("base64");

    // Save the new picture to the database
    await User.updateOne(
      { username: req.params.username },
      { profilePicture: base64Image }
    );

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    {
      const user = await User.findOne({ username: req.params.username });

      // Send the image data to the client
      res.send(user.profilePicture);
    }
  }
);

// Deleting one
router.delete(
  "/:username",
  [cors(), getUserWithPasswordByUsername],
  async (req, res) => {
    if (res.user != null) {
      if (!(await verifyPassword(req.body.password, res.user.password))) {
        res.json({ message: "Given password is incorrect." });
      } else {
        // Oprócz samego użytkownika, usuwamy go też z list followers i following innych użytkowników
        await User.updateMany(
          { $or: [{ followers: res.user.id }, { following: res.user.id }] },
          { $pull: { followers: res.user.id, following: res.user.id } }
        );

        // log do pliku
        fs.appendFileSync(
          "./logFile.txt",
          `${new Date().toDateString()} -> ${res.user.username} usunął konto.\n`
        );

        await res.user.remove();
        res.json({ message: "User deleted" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

async function getUserByUsername(req, res, next) {
  let user;
  try {
    user = await User.findOne(
      {
        username: req.params.username || req.body.username,
      },
      { _id: 0, password: 0 }
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

async function getUserWithPasswordByUsername(req, res, next) {
  let user;
  try {
    user = await User.findOne({
      username: req.params.username || req.body.username,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
