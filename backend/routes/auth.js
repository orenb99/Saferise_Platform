const express = require("express");
const prisma = require("../prisma/prisma-client");
const { generateToken, verifyToken } = require("../middleware/auth");
const { sanitizeInput, validateSignup, validateSignin } = require("../middleware/validation");

const router = express.Router();

// Sign Up Route
router.post("/signup", sanitizeInput, validateSignup, async (req, res) => {
  try {
    const { fullName, email, id, role, password } = req.body;
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { id }] } });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "ID";
      return res.status(400).json({
        error: `User with this ${field} already exists`,
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id,
        fullName,
        email,
        role,
        password,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    // CHECK!!!
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message, details: error.details });
    }
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Duplicate field",
        details: [error.meta.target.join(", ")],
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
    const { fullName, id, password } = req.body;

    // Find user by name and Israeli ID
    const user = await prisma.user.findFirst({
      where: { AND: [{ fullName: { equals: fullName, mode: "insensitive" } }, { id }] },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }

    // Check password
    const isPasswordValid = await prisma.user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: "Sign in successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
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
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
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
