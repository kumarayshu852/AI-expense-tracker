const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const RecurringTransaction = require('../models/RecurringTransaction');
const { processRecurringTransactions } = require('../services/cronService');

// Next due date helper
const getNextDueDate = (startDate, frequency) => {
  const next = new Date(startDate);
  switch (frequency) {
    case 'daily': next.setDate(next.getDate() + 1); break;
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
    default: next.setMonth(next.getMonth() + 1);
  }
  return next;
};

// @desc    Get all recurring transactions
// @route   GET /api/recurring
const getRecurring = asyncHandler(async (req, res) => {
  const transactions = await RecurringTransaction.find({ userId: req.user._id })
    .sort({ nextDueDate: 1 });
  return ApiResponse.success(res, { transactions });
});

// @desc    Create recurring transaction
// @route   POST /api/recurring
const createRecurring = asyncHandler(async (req, res) => {
  const { title, amount, type, category, paymentMethod, notes, frequency, startDate } = req.body;

  const start = new Date(startDate || Date.now());
  const nextDueDate = getNextDueDate(start, frequency);

  const transaction = await RecurringTransaction.create({
    userId: req.user._id,
    title,
    amount,
    type,
    category,
    paymentMethod,
    notes,
    frequency,
    startDate: start,
    nextDueDate,
  });

  return ApiResponse.success(res, { transaction }, 'Recurring transaction created', 201);
});

// @desc    Toggle active/inactive
// @route   PUT /api/recurring/:id/toggle
const toggleRecurring = asyncHandler(async (req, res) => {
  const transaction = await RecurringTransaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }

  transaction.isActive = !transaction.isActive;
  await transaction.save();

  return ApiResponse.success(res, { transaction }, `Recurring transaction ${transaction.isActive ? 'activated' : 'paused'}`);
});

// @desc    Delete recurring transaction
// @route   DELETE /api/recurring/:id
const deleteRecurring = asyncHandler(async (req, res) => {
  const transaction = await RecurringTransaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }

  await transaction.deleteOne();
  return ApiResponse.success(res, {}, 'Recurring transaction deleted');
});

// @desc    Manually trigger processing (testing ke liye)
// @route   POST /api/recurring/process
const triggerProcess = asyncHandler(async (req, res) => {
  await processRecurringTransactions();
  return ApiResponse.success(res, {}, 'Recurring transactions processed');
});

module.exports = { getRecurring, createRecurring, toggleRecurring, deleteRecurring, triggerProcess };