const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const {
  sanitizeInput,
  validateSearchReviews,
  validateReviewId,
  validateReview,
} = require("../middleware/validation");

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
      select: {
        reviewId: true,
        reviewDate: true,
        assetId: true,
        reviewerDecision: true,
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
        defects: true,
        instructions: true,
        assemblies: true,
        reviewer: {
          select: {
            reviewerId: true,
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

router.put("/:reviewId", validateReviewId, validateReview, verifyToken, async (req, res) => {
  try {
    // (NOTE FOR NEXT DEVELOPER)
    // The idea behind this type of update, which is delete all and then recreate, is so we could be able to add and remove
    // instructions, defects and assemblies from the review.
    const { reviewId } = req.params;
    // Remove the relations before updating
    const { defects, assemblies, instructions, asset, reviewer, reviewDate, ...otherFields } =
      req.body;
      
    // Fix the date format for reviewDate
    const date = new Date(reviewDate);
    if (date !== "Invalid Date") {
      otherFields.reviewDate = date;
    }
    // Filter out problematic fields (PK, FK and read only fields)
    const cleanDefects = defects.map(
      ({ reviewId, createdAt, updatedAt, assetId, resolvedDate, ...rest }) => {
        // Fix the date format for resolvedDate
        const date = new Date(resolvedDate);
        if (date !== "Invalid Date") {
          return { ...rest, resolvedDate: date };
        }
        return rest;
      }
    );
    const cleanInstructions = instructions.map(
      ({ reviewId, createdAt, updatedAt, assetId, ...rest }) => rest
    );
    const cleanAssemblies = assemblies.map(
      ({ reviewId, createdAt, updatedAt, assetId, ...rest }) => rest
    );
    const updatedReview = await prisma.review.update({
      where: { reviewId },
      data: {
        ...otherFields,
        defects: {
          deleteMany: {}, // deletes all existing defects for this review
          createMany: { data: cleanDefects || [] }, // Adding all the new ones
        },
        instructions: {
          deleteMany: {},
          createMany: { data: cleanInstructions || [] },
        },
        assemblies: {
          deleteMany: {},
          createMany: { data: cleanAssemblies || [] },
        },
      },
      // For the review
      include: {
        defects: true,
        instructions: true,
        assemblies: true,
        asset: { include: { reviews: true } },
      },
    });

    res.status(201).json({ message: "Update Succeeded", data: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
