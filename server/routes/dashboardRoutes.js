const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);


// Dashboard summary
router.get('/summary', dashboardController.getDashboardSummary);

// Inventory
router.get('/stock-alerts', dashboardController.getStockAlerts);

// Charts
router.get('/monthly-sales', dashboardController.getMonthlySales);
router.get('/purchase-vs-sales', dashboardController.getPurchaseVsSales);

// Product performance
router.get('/top-products', dashboardController.getTopProducts);

// Recent transactions
router.get('/recent-sales', dashboardController.getRecentSales);
router.get('/recent-purchases', dashboardController.getRecentPurchases);

// Activity
router.get('/recent-activity', dashboardController.getRecentActivity);

module.exports = router;
