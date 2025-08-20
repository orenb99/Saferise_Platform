const prisma = require("./prisma-client");

// Connect to database
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("connected to the database");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
