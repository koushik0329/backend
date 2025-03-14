const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  softDeleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTasks).post(protect, createTask);
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

router.put("/:id/status", protect, updateTaskStatus);

router.post("/", protect, upload.single("attachment"), createTask);

router.delete("/:id", protect, softDeleteTask);

module.exports = router;
