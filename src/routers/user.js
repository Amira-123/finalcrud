const express = require("express");
const router = new express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");

// //////////////////////////////signup
router.post("/user", async (req, res) => {
  try {
    const users = new User(req.body);
    await users.save();
    const token = await users.generateToken();
    res.status(200).send({ users, token });
  } catch (e) {
    res.status(400).send("error occured" + e);
  }
});

// get  user by id

router.get("/user/:id", auth, (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(400).send("Unable to find user");
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send("Unable to connect to database " + e);
    });
});
// update user

router.patch("/user/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(400).send("No user is found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send("Error has occured" + e);
  }
});
// profile
router.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});

// //////////////////delete by id
router.delete("/user/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).send("Not found user");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send("error occured" + e);
  }
});
// /////////////////////login
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send("Try again" + e);
  }
});

// // logout

router.delete("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.user.save();
    res.send("logout success");
  } catch (e) {
    res.send("error ccured " + e);
  }
});

module.exports = router;
