const Task = require("../models/taskModel");
const redisClient = require("../server");

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    attachment: req.file ? req.file.path : undefined, // Save file path if uploaded
  });

  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const userId = req.user._id;
  const cacheKey = `tasks:${userId}`;

  try {
    const cachedTasks = await redisClient.get(cacheKey); // ← `await` is important

    if (cachedTasks) {
      console.log("🟢 Cache hit");
      return res.status(200).json(JSON.parse(cachedTasks));
    }

    console.log("🟡 Cache miss");
    const tasks = await Task.find({ user: userId });

    await redisClient.set(cacheKey, JSON.stringify(tasks), {
      EX: 3600, // Cache expiry in seconds
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Redis error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await task.remove();
  res.status(200).json({ message: "Task removed" });
};

const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  task.isCompleted = !task.isCompleted; // Toggle status
  await task.save();

  res.status(200).json(task);
};

const softDeleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this task");
  }

  task.isDeleted = true;
  await task.save();

  res.status(200).json({ message: "Task soft deleted" });
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  softDeleteTask,
};
