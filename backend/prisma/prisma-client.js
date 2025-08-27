const { PrismaClient, Prisma } = require("@prisma/client");
const validateFields = require("../model_functions/Inspector");
const bcrypt = require("bcryptjs");
const { createOrderPDF } = require("../model_functions/SafetyOrder");
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
    return next(params);
  } else if (params.model === "SafetyOrder") {
    if (params.action === "create") {
      // If crated a safety order instance, also create a pdf file and an alert
      // first save the user
      const result = await next(params);
      // Create the pdf
      createOrderPDF(params.args.data);
      // TODO : create a corresponding alert
      return result;
    }
  } else {
    return next(params);
  }
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
