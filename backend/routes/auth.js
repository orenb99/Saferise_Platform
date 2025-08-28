const express = require("express");
const prisma = require("../prisma/prisma-client");
const { generateToken, verifyToken } = require("../middleware/auth");
const { sanitizeInput, validateSignup, validateSignin } = require("../middleware/validation");
const { InspectorType } = require("@prisma/client");

const router = express.Router();

// Sign Up Route
router.post("/signup", sanitizeInput, validateSignup, async (req, res) => {
  try {
    const { fullName, email, inspectorId, password, phoneNumber, inspectorType, employeeId } =
      req.body;
    // Check if user already exists
    const existingUser = await prisma.inspector.findFirst({
      where: { OR: [{ email }, { inspectorId }, { phoneNumber }, { employeeId }] },
    });

    if (existingUser) {
      const field =
        existingUser.email === email
          ? "email"
          : existingUser.inspectorId === inspectorId
          ? "ID"
          : existingUser.phoneNumber === phoneNumber
          ? "phone number"
          : "employee ID";
      return res.status(400).json({
        error: `User with this ${field} already exists`,
      });
    }
    // Create new user
    const inspector = await prisma.inspector.create({
      data: {
        inspectorId,
        fullName,
        email,
        password,
        employeeId,
        phoneNumber,
        inspectorType: inspectorType ? InspectorType.Regional : InspectorType.Chief,
      },
    });

    // Generate token
    const token = generateToken(inspector.inspectorId);

    return res.status(201).json({
      message: "User created successfully",
      token,
      inspector: {
        fullName: inspector.fullName,
        email: inspector.email,
        inspectorId: inspector.inspectorId,
        employeeId: inspector.employeeId,
        phoneNumber: inspector.phoneNumber,
        inspectorType: inspector.inspectorType,
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
    const { fullName, inspectorId, password } = req.body;

    // Find user by name and Israeli ID
    const inspector = await prisma.inspector.findFirst({
      where: { AND: [{ fullName: { equals: fullName, mode: "insensitive" } }, { inspectorId }] },
    });

    if (!inspector) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }
    // Check password
    const isPasswordValid = await prisma.inspector.comparePassword(password, inspector.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your name, ID, and password.",
      });
    }

    // Generate token
    const token = generateToken(inspector.inspectorId);

    res.json({
      message: "Sign in successful",
      token,
      inspector: {
        fullName: inspector.fullName,
        email: inspector.email,
        inspectorId: inspector.inspectorId,
        phoneNumber: inspector.phoneNumber,
        employeeId: inspector.employeeId,
        inspectorType: inspector.inspectorType,
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
      inspector: {
        fullName: req.inspector.fullName,
        email: req.inspector.email,
        inspectorId: req.inspector.inspectorId,
        phoneNumber: req.inspector.phoneNumber,
        employeeId: req.inspector.employeeId,
        inspectorType: req.inspector.inspectorType,
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
