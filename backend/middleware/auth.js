const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma-client");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secure_jwt_secret_key_change_this_in_production";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" }); // Change to 2h in production
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

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
