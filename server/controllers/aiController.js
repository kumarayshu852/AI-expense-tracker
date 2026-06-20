const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { askGroq } = require('../services/groqService');
const { getAIContext } = require('../services/analyticsService');
const ChatMessage = require('../models/ChatMessage');

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error('Message is required');
  }

  // User ka message pehle save kar do
  await ChatMessage.create({ userId: req.user._id, role: 'user', content: message });

  const financialContext = await getAIContext(req.user._id);
  const aiResponse = await askGroq(message, financialContext);

  // AI ka reply bhi save kar do
  await ChatMessage.create({ userId: req.user._id, role: 'ai', content: aiResponse });

  return ApiResponse.success(res, { reply: aiResponse }, 'AI response generated');
});

// @desc    Auto-generate insights for dashboard
// @route   GET /api/ai/insights
const getInsights = asyncHandler(async (req, res) => {
  const financialContext = await getAIContext(req.user._id);

  const insightPrompt = `Based on the user's financial data, generate 3 short actionable insights:
1. Top spending category warning (if any category > 30% of total)
2. One savings suggestion
3. One positive observation
Keep each insight under 2 lines.`;

  const insights = await askGroq(insightPrompt, financialContext);

  return ApiResponse.success(res, { insights }, 'Insights generated');
});

// @desc    Get chat history
// @route   GET /api/ai/history
const getHistory = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ userId: req.user._id })
    .sort({ createdAt: 1 })
    .limit(100);

  return ApiResponse.success(res, { messages });
});

// @desc    Clear chat history
// @route   DELETE /api/ai/history
const clearHistory = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({ userId: req.user._id });
  return ApiResponse.success(res, {}, 'Chat history cleared');
});

module.exports = { chat, getInsights, getHistory, clearHistory };