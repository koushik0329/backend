const Task = require("../models/taskModel");

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
  });

  res.status(201).json(task);
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
/*const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.status(200).json(tasks);
};*/
// GET /api/tasks?status=completed&sortBy=newest
/*const getTasks = async (req, res) => {
  const { status, sortBy } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const sortOptions = {};
  if (sortBy === "newest") sortOptions.createdAt = -1;
  if (sortBy === "oldest") sortOptions.createdAt = 1;

  const tasks = await Task.find(query).sort(sortOptions);
  res.status(200).json(tasks);
};*/
// GET /api/tasks?page=2&limit=5
const getTasks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find({ user: req.user._id }).skip(skip).limit(limit);

  const totalTasks = await Task.countDocuments({ user: req.user._id });

  res.status(200).json({
    page,
    totalPages: Math.ceil(totalTasks / limit),
    tasks,
  });
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
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

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.status(200).json({ message: "Task removed" });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
