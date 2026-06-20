const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Har user ki history time order mein fetch karne ke liye
chatMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);