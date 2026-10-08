const express = require("express");
const router = express.Router();
const { getDashboardSummary, getAnalyticsReport, getDemandForecast } = require("../controllers/AnalyticsController");

router.get("/summary", getDashboardSummary);
router.get("/reports", getAnalyticsReport);
router.get("/forecast", getDemandForecast);

module.exports = router;
