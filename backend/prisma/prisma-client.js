const { PrismaClient } = require("@prisma/client");
const validateFields = require("../models/User");
const bcrypt = require("bcryptjs");
// Custom schema functions
const prisma_base = new PrismaClient();

// Middlewares
prisma_base.$use(async (params, next) => {
  if (params.model === "User") {
    if (params.action === "create" || params.action === "update") {
      const userData = params.args.data;
      // Validate fields before saving
      validateFields(userData);
      if (userData.password) {
        // Hash password before saving
        const salt = await bcrypt.genSalt(12);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
    }
  }
  return next(params);
});

const prisma = prisma_base.$extends({
  model: {
    user: {
      // Compare password method
      async comparePassword(candidatePassword, encryptedPassword) {
        return await bcrypt.compare(candidatePassword, encryptedPassword);
      },
    },
  },
});

module.exports = prisma;
