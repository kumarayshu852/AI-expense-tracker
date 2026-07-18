const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Others'];

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['expense', 'income']).withMessage('Type must be expense or income'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('paymentMethod').optional().isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

router.use(protect);

router.get('/', expenseController.getExpenses);
router.post('/', expenseValidation, validate, expenseController.createExpense);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseValidation, validate, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;