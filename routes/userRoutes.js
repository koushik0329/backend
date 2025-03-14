const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/users/register
// @access  Public
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateToken(decoded.id);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.get("/profile", protect, getUserProfile);

router.get("/admin/users", protect, admin, getUserProfile);

module.exports = router;
