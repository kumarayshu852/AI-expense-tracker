const mongoose = require('mongoose');

const billSplitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    members: [
      {
        name: { type: String, required: true, trim: true },
      }
    ],
    expenses: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        paidBy: { type: String, required: true }, // member name
        splitAmong: [{ type: String }], // member names
      }
    ],
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

billSplitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('BillSplit', billSplitSchema);