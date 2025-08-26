const express = require("express");
const prisma = require("../prisma/prisma-client");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const { AlertType } = require("@prisma/client");
router.get("/top", verifyToken, async (req, res) => {
  try {
    const { inspectorId } = req.inspector;

    // Count active alerts for the inspector (CHECK FOR CHIEF INSPECTOR)
    const count = await prisma.alert.count({
      where: { inspectorId }, // Check the filter
    });
    const topFive = await prisma.alert.findMany({
      where: { inspectorId },
      select: {
        alertId: true,
        title: true,
        priority: true,
        status: true,
        dueDate: true,
        alertType: true,
      },
      take: 5,
      orderBy: [{ priority: "desc" }, { dueDate: "desc" }], // CHECK LATER THE SORTING KEY
    });
    res.status(200).json({ message: "Count fetched successfully", data: { count, topFive } });
  } catch (error) {
    console.error("Error fetching alerts", error);
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
    // Fetch active alerts for the inspector
    const alerts = await prisma.alert.findMany({
      where: { inspectorId },
      orderBy: [{ priority: "desc" }, { dueDate: "desc" }],
    });
    // Return a list of alerts for each type
    const data = {};
    for (const type of Object.values(AlertType)) {
      data[type] = alerts.filter((item) => item.alertType === type);
    }
    res.status(200).json({ message: "alerts fetched successfully", data });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
