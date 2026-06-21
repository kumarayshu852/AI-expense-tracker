const mongoose = require('mongoose');


const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Investment',
  'Loans & Lending',
  'Personal & Lifestyle',
  'Income',
  'Others',
];


const PAYMENT_METHODS = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Others',
];

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot excced 100 characters"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },
        type: {
            type: String,
            enum: ['expense', 'income'],
            default: "expense",
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: CATEGORIES,
            default: 'Others',
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
        date: {
            type: Date,
            default: Date.now,
        },
    },
     { timestamps: true }

);

expenseSchema.index({userId:1, date: -1});
expenseSchema.index({userId:1, category:1});

module.exports =mongoose.model('Expense',expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;