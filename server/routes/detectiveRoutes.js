const express = require('express');
const router = express.Router();
const { getDetectiveAnalysis } = require('../controllers/detectiveController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getDetectiveAnalysis);

module.exports = router;