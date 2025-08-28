const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const alertRoutes = require("./routes/alert");
const orderRoutes = require("./routes/order");
const connectDB = require("./prisma/database");
const path = require("path");
// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    frameguard: false, // disables X-Frame-Options header for pdf extraction
  })
);
// Test connection to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs (CHANGE LATER)
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 800, // limit each IP to 5 auth requests per windowMs (CHANGE LATER)
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Saferise Platform API is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(
  "/api/public",
  (req, res, next) => {
    // Allow embedding from your frontend
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${
        process.env.NODE_ENV === "production"
          ? ["https://yourdomain.com"]
          : ["http://localhost:3000"]
      }`
    );
    next();
  },
  express.static(path.join(__dirname, "public"))
);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/orders", orderRoutes);
// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(error.status || 500).json({
    error: isDevelopment ? error.message : "Internal server error",
    ...(isDevelopment && { stack: error.stack }),
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
