const express = require("express");
const User = require("../models/User");
const { generateToken, verifyToken } = require("../middleware/auth");
const { sanitizeInput, validateSignup, validateSignin } = require("../middleware/validation");

const router = express.Router();

// Sign Up Route
router.post("/signup", sanitizeInput, validateSignup, async (req, res) => {
  try {
    const { fullName, email, israeliId, role, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { israeliId }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "Israeli ID";
      return res.status(400).json({
        error: `User with this ${field} already exists`,
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      israeliId,
      role,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        israeliId: user.israeliId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      error: "Server error during registration",
    });
  }
});

// Sign In Route
router.post("/signin", sanitizeInput, validateSignin, async (req, res) => {
  try {
    const { fullName, israeliId, password } = req.body;

    // Find user by name and Israeli ID
    const user = await User.findOne({
      fullName: { $regex: new RegExp(`^${fullName}$`, "i") },
      israeliId,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Sign in successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        israeliId: user.israeliId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Server error during sign in",
    });
  }
});

// Get Current User Route (for protecting routes)
router.get("/me", verifyToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        israeliId: req.user.israeliId,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Server error retrieving user information",
    });
  }
});

module.exports = router;
