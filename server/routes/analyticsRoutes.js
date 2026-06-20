const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', analyticsController.dashboardStats);
router.get('/categories', analyticsController.categoryBreakdown);
router.get('/trend', analyticsController.dailyTrend);

module.exports = router;