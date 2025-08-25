const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/top", verifyToken, async (req, res) => {
  try {
    const { inspectorId } = req.inspector;

    // Count active orders for the inspector (CHECK FOR CHIEF INSPECTOR)
    const count = await prisma.order.count({
      where: { inspectorId, isActive: true },
    });
    const topFive = await prisma.order.findMany({
      where: { inspectorId, isActive: true },
      take: 5,
      orderBy: [{ orderType: "asc" }, { dueDate: "desc" }], // CHECK LATER THE SORTING KEY
    });
    res.status(200).json({ message: "Count fetched successfully", data: { count, topFive } });
  } catch (error) {
    console.error("Error fetching order", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const { inspectorId } = req.inspector;

    // TODO:
    //  (CHECK FOR CHIEF INSPECTOR)
    //  (CHECK LATER IF NEEDED TO RETURN 20 AT A TIME)
    //  (CHECK LATER THE SORTING KEY)
    // Fetch active orders for the inspector
    const orders = await prisma.order.findMany({
      where: { inspectorId, isActive: true },
    });

    res.status(200).json({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("Error fetching order amount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
