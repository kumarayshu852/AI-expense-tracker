const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const billSplitController = require('../controllers/billSplitController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', billSplitController.getBillSplits);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('members').isArray({ min: 2 }).withMessage('At least 2 members required'),
    body('members.*').trim().notEmpty().withMessage('Member name cannot be empty'),
  ],
  validate,
  billSplitController.createBillSplit
);

router.get('/:id', billSplitController.getBillSplitById);

router.post(
  '/:id/expense',
  [
    body('title').trim().notEmpty().withMessage('Expense title is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('paidBy').trim().notEmpty().withMessage('PaidBy is required'),
    body('splitAmong').isArray({ min: 1 }).withMessage('Split among at least 1 member'),
  ],
  validate,
  billSplitController.addExpense
);

router.delete('/:id/expense/:expenseId', billSplitController.removeExpense);
router.put('/:id/settle', billSplitController.settleBillSplit);
router.delete('/:id', billSplitController.deleteBillSplit);

module.exports = router;