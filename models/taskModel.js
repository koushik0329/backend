const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
    },
    isCompleted: { type: Boolean, default: false }, // New field
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
    attachment: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
