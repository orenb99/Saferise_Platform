const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const { sanitizeInput, validateSearchReviews } = require("../middleware/validation");

const router = express.Router();
router.get("/search", validateSearchReviews, verifyToken, async (req, res) => {
  try {
    const { query, toDate, fromDate, region, status } = req.query;
    let searchQuery = {};
    // Build dynamic query based on provided parameters
    if (query) {
      searchQuery.OR = [
        { reviewId: { contains: query, mode: "insensitive" } }, // Search in reviewId
        { reviewerId: { contains: query, mode: "insensitive" } }, // Search in reviewerId
        { reviewer: { fullName: { contains: query, mode: "insensitive" } } }, // Search in reviewer's fullName
        { assetId: { contains: query, mode: "insensitive" } }, // Search in assetId
        {
          asset: (OR = [
            { name: { contains: query, mode: "insensitive" } }, // Search in asset's name
            { siteId: { contains: query, mode: "insensitive" } }, // Search in asset's siteId
            { productId: { contains: query, mode: "insensitive" } }, // Search in asset's productId
            { assetOwner: { fullName: { contains: query, mode: "insensitive" } } }, // Search in asset's owner's fullName
          ]),
        }, // Search in asset's siteId
      ];
    }
    if (toDate && fromDate) {
      if (new Date(toDate) < new Date(fromDate)) {
        return res.status(400).json({ error: "'toDate' cannot be earlier than 'fromDate'" });
      }
      searchQuery.installationDate = {};
      if (toDate) {
        searchQuery.installationDate.lte = new Date(toDate);
      }
      if (fromDate) {
        searchQuery.installationDate.gte = new Date(fromDate);
      }
    }
    if (region) {
      // Change to coordinates and address checking
    }
    if (status) {
      // Check what status should be
    }
    const data = await prisma.review.findMany({
      where: searchQuery,
      include: {
        createdAt: false,
        updatedAt: false,
        reviewer: {
          select: {
            accountId: true,
            fullName: true,
          },
        },
        asset: true,
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

module.exports = router;
