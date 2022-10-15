const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("dotenv").config();

const app = express();

const port = process.env.PORT;

app.use(express.json());
require("./db/mongoose");

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
