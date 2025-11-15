const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Result = require("../models/Result");

// GET endpoint to fetch user details and their quiz results
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all results for this user, sorted by creation date (newest first)
    const results = await Result.find({ username: user.username })
      .sort({ createdAt: -1 });

    res.json({ user, results });
  } catch (err) {
    console.error("Error in profile route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;