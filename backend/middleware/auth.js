const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secure_jwt_secret_key_change_this_in_production";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    res.status(500).json({ error: "Server error during token verification." });
  }
};

module.exports = { generateToken, verifyToken };
