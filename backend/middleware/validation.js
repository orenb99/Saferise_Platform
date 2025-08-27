const { body, query, param, validationResult } = require("express-validator");
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

  body("inspectorId")
    .isLength({ min: 9, max: 9 })
    .withMessage("ID must be exactly 9 digits")
    .isNumeric()
    .withMessage("ID must contain only numbers"),

  body("phoneNumber")
    .matches(/^05\d[- ]?\d{3}[- ]?\d{4}$/)
    .withMessage("Phone number must be a valid Israeli mobile number"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("employeeId")
    .isLength({ min: 3, max: 100 })
    .withMessage("Employee ID must be between 3 and 100 characters"),
  checkValidation,
  body("inspectorType").isBoolean().withMessage("Type must be a boolean"),
];

// Validation rules for signin
const validateSignin = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),

  body("inspectorId")
    .isLength({ min: 9, max: 9 })
    .withMessage("ID must be exactly 9 digits")
    .isNumeric()
    .withMessage("ID must contain only numbers"),

  body("password").notEmpty().withMessage("Password is required"),

  checkValidation,
];

const validateSearchReviews = [
  query("query")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[a-zA-Z0-9\s\-]{0,100}$/)
    .withMessage("Invalid search query"),
  // Change later for address query
  query("region").optional().isLength({ max: 100 }),
  query("toDate")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid to date format"),
  query("fromDate")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid from date format"),
  // Change later to match desired status values
  query("status").optional({ nullable: true, checkFalsy: true }).isArray(),
  checkValidation,
];
const validateReviewId = [
  // Change later to match desired ID format
  param("reviewId")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Invalid review ID"),
  checkValidation,
];
// FILL LATER WITH AI
const validateReview = [
  body("maxPassengers").isInt().withMessage("Max Passengers must be a number"),
  checkValidation,
];

// FILL LATER WITH AI
const validateOrder = [
  param("orderId")
    .matches(/^[a-zA-Z0-9]{0,18}$/)
    .withMessage("Invalid order ID"),
  checkValidation,
];
module.exports = {
  sanitizeInput,
  validateSignup,
  validateSignin,
  validateSearchReviews,
  validateReviewId,
  validateOrder,
  validateReview,
};
