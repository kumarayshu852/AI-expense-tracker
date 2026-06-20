const mongoose = require('mongoose');
const { CATEGORIES } = require('./Expense');

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: CATEGORIES,
        },
            monthlyLimit: {
                type: Number,
                required: [true, 'Monthly limit is required'],
                min: [1, 'Monthly limit must be at least 1'],
            },
            month: {
                type: Number,
                required: true,
            },
            year: {
                type: Number,
                required: true,
            },

        },
    { timestamps: true }
)
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });
module.exports = mongoose.model('Budget', budgetSchema);