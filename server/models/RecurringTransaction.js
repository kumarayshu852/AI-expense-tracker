const mongoose = require('mongoose');

const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Others'];

const recurringTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'Cash',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    frequency: {
      type: String,
      enum: FREQUENCIES,
      required: true,
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastProcessed: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

recurringTransactionSchema.index({ userId: 1, isActive: 1, nextDueDate: 1 });

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
module.exports.FREQUENCIES = FREQUENCIES;