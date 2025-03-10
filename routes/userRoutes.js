const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

// @route   POST /api/users/register
// @access  Public
router.post("/register", registerUser);

module.exports = router;
