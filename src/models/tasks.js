const mongoose = require("mongoose");
const newsScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

const Tasks = mongoose.model("Tasks", newsScehma);
module.exports = Tasks;
