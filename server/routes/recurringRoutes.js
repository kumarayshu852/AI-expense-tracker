const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const recurringController = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', recurringController.getRecurring);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('type').isIn(['expense', 'income']).withMessage('Type must be expense or income'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency'),
    body('startDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  recurringController.createRecurring
);

router.put('/:id/toggle', recurringController.toggleRecurring);
router.delete('/:id', recurringController.deleteRecurring);
router.post('/process', recurringController.triggerProcess);

module.exports = router;