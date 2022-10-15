const express = require("express");
const Tasks = require("../models/tasks");
const router = new express.Router();
const auth = require("../middleware/auth");
// ////// post news and know who create it
router.post("/task", auth, async (req, res) => {
  try {
    const task = new Tasks({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    // console.log("add task")
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send("error has occured" + e);
  }
});

// get task by id
router.get("/task/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(400).send("No task is found");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send("Error has occurred" + e);
  }
});
// ////////////////get all tasks
router.get("/getAllTasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks");
    res.send(req.user.tasks);
  } catch (e) {
    res.status(404).send("error occured" + e);
  }
});
// // // update by id
router.patch("/task/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description"];
    let isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
      return res.status(400).send("Can't update ,update title and description");
    }
    const _id = req.params.id;
    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Not found Tasks");
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send("Error has occurred " + e);
  }
});
// // delete by id
router.delete("/task/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Not found this task");
    }
    // console.log("deleted task")
    res.send(task);
  } catch (e) {
    res.status(500).send("Error occurred " + e);
  }
});
module.exports = router;
