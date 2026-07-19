const express = require('express');
const router = express.Router();
const { getPersonality } = require('../controllers/personalityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getPersonality);

module.exports = router;