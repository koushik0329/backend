const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/users/register
// @access  Public
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

module.exports = router;
