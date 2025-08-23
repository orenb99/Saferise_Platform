const { PrismaClient, Prisma } = require("@prisma/client");
const validateFields = require("../models/Inspector");
const bcrypt = require("bcryptjs");
// Custom schema functions
const prisma_base = new PrismaClient();

// Middlewares
prisma_base.$use(async (params, next) => {
  if (params.model === "Inspector") {
    if (params.action === "create" || params.action === "update") {
      const inspectorData = params.args.data;
      // Validate fields before saving
      validateFields(inspectorData);
      if (inspectorData.password) {
        // Hash password before saving
        const salt = await bcrypt.genSalt(12);
        inspectorData.password = await bcrypt.hash(inspectorData.password, salt);
      }
    }
  }
  return next(params);
});

const prisma = prisma_base.$extends({
  model: {
    inspector: {
      // Compare password method
      async comparePassword(candidatePassword, encryptedPassword) {
        return await bcrypt.compare(candidatePassword, encryptedPassword);
      },
    },
  },
});

module.exports = prisma;
