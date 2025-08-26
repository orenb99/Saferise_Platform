const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const {
  sanitizeInput,
  validateSearchReviews,
  validateReviewId,
} = require("../middleware/validation");
const { ReviewerDecision } = require("@prisma/client");

const router = express.Router();
router.get("/search", validateSearchReviews, verifyToken, async (req, res) => {
  try {
    const { query, toDate, fromDate, status } = req.query;
    let searchQuery = {};
    // Build dynamic query based on provided parameters
    if (query) {
      searchQuery.OR = [
        { reviewId: { contains: query, mode: "insensitive" } },
        { reviewerId: { contains: query, mode: "insensitive" } },
        { reviewer: { fullName: { contains: query, mode: "insensitive" } } },
        { assetId: { contains: query, mode: "insensitive" } },
        {
          asset: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { siteId: { contains: query, mode: "insensitive" } },
              { productId: { contains: query, mode: "insensitive" } },
              { assetOwner: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
        },
      ];
    }
    if (toDate && fromDate) {
      from = new Date(fromDate);
      to = new Date(toDate);
      if (from.toString() === "Invalid Date" || to.toString() === "Invalid Date") {
        return res.status(400).json({ error: "Invalid date format" });
      }
      if (to < from) {
        return res.status(400).json({ error: "to date cannot be earlier than from date" });
      }
      searchQuery.reviewDate = {};
      if (toDate) {
        searchQuery.reviewDate.lte = new Date(toDate);
      }
      if (fromDate) {
        searchQuery.reviewDate.gte = new Date(fromDate);
      }
    }

    if (status) {
      // Check what status should be
    }
    const data = await prisma.review.findMany({
      where: searchQuery,
      include: {
        assetId: true,
        reviewDate: true,
        ReviewerDecision: true,
        reviewer: {
          select: {
            reviewerId: true,
            fullName: true,
          },
        },
        asset: {
          select: {
            site: {
              select: {
                addressId: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      message: "Search successful",
      data,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:reviewId", validateReviewId, verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await prisma.review.findUnique({
      where: { reviewId },
      include: {
        createdAt: false,
        updatedAt: false,
        alerts: false,
        processingQueues: false,
        reviewer: {
          select: {
            accountId: true,
            fullName: true,
          },
        },
        asset: {
          include: {
            reviews: {
              where: { NOT: { reviewId } },
              select: { reviewId: true, reviewDate: true },
              orderBy: { reviewDate: "desc" },
            },
          },
        },
      },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.status(200).json({ message: "Review retrieved successfully", data: review });
  } catch (error) {
    console.error("Get review error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
