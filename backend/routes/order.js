const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");
const router = express.Router();

router.post("/", validateOrder, verifyToken, async (req, res) => {
  try {
    const { orderId, reviewId, orderNumber, orderContent, orderType, dueDate } = req.body;
    const review = await prisma.review.findUnique({
      where: { reviewId },
      select: { reviewId: true, assetId: true },
    });
    if (!review)
      return res.status(404).json({
        error: "Review not found",
      });
    await prisma.safetyOrder.create({
      data: {
        orderId,
        reviewId,
        orderNumber,
        orderContent,
        orderType,
        dueDate: new Date(dueDate),
        assetId: review.assetId,
        inspectorId: req.inspector.inspectorId,
      },
    });
    return res.sendStatus(201);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      error: "Server error during order creation",
    });
  }
});

module.exports = router;
