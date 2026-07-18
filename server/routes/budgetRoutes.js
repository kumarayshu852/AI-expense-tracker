const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', budgetController.getBudgets);

router.post(
  '/',
  [
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('monthlyLimit').isFloat({ min: 1 }).withMessage('Monthly limit must be at least 1'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    body('year').isInt({ min: 2020 }).withMessage('Invalid year'),
  ],
  validate,
  budgetController.createBudget
);

router.delete('/:id', budgetController.deleteBudget);

module.exports = router;