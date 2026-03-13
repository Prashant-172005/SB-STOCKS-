const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// @desc  Get user profile + balance
// @route GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Update username/email
// @route PUT /api/users/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
