const { body, validationResult } = require("express-validator");
const xss = require("xss");

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = xss(req.body[key].trim());
    }
  }
  next();
};

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Validation rules for signup
const validateSignup = [
  body("fullName")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s\u0590-\u05FF]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),

  body("id")
    .isLength({ min: 9, max: 9 })
    .withMessage("ID must be exactly 9 digits")
    .isNumeric()
    .withMessage("ID must contain only numbers"),

  body("role")
    .isIn(["Employee", "Supervisor", "Director"])
    .withMessage("Role must be Employee, Supervisor, or Director"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  checkValidation,
];

// Validation rules for signin
const validateSignin = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),

  body("israeliId")
    .isLength({ min: 9, max: 9 })
    .withMessage("ID must be exactly 9 digits")
    .isNumeric()
    .withMessage("ID must contain only numbers"),

  body("password").notEmpty().withMessage("Password is required"),

  checkValidation,
];

module.exports = {
  sanitizeInput,
  validateSignup,
  validateSignin,
};
