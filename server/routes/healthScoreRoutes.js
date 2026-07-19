const express = require('express');
const router = express.Router();
const { getHealthScore } = require('../controllers/healthScoreController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getHealthScore);

module.exports = router;