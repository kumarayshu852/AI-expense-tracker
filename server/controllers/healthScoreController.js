const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { calculateHealthScore } = require('../services/healthScoreService');
const { askGroq } = require('../services/groqService');

// @desc    Get financial health score
// @route   GET /api/health-score
const getHealthScore = asyncHandler(async (req, res) => {
  const scoreData = await calculateHealthScore(req.user._id);

  // Groq se personalized feedback generate karo
  const prompt = `
You are a personal finance advisor. Based on this user's financial data, give a SHORT (3-4 lines max) personalized feedback in Hinglish (mix of Hindi and English).

Financial Data:
- Health Score: ${scoreData.totalScore}/100 (Grade: ${scoreData.grade})
- Savings Rate: ${scoreData.rawData.savingsRate}%
- Total Income: ₹${scoreData.rawData.totalIncome.toLocaleString('en-IN')}
- Total Expense: ₹${scoreData.rawData.totalExpense.toLocaleString('en-IN')}
- Budgets Set: ${scoreData.rawData.totalBudgets}
- Categories Used: ${scoreData.rawData.categoryCount}
- Transactions: ${scoreData.rawData.totalTransactions}

Score Breakdown:
- Savings: ${scoreData.breakdown.savingsScore.score}/${scoreData.breakdown.savingsScore.max}
- Budget Adherence: ${scoreData.breakdown.budgetScore.score}/${scoreData.breakdown.budgetScore.max}
- Consistency: ${scoreData.breakdown.consistencyScore.score}/${scoreData.breakdown.consistencyScore.max}
- Diversity: ${scoreData.breakdown.diversityScore.score}/${scoreData.breakdown.diversityScore.max}
- Data Completeness: ${scoreData.breakdown.completenessScore.score}/${scoreData.breakdown.completenessScore.max}

Give:
1. One encouraging sentence about their score
2. Their biggest strength
3. One specific actionable improvement tip
Keep it friendly, motivating, and under 4 lines total.
`;

  let aiFeedback = '';
  try {
    aiFeedback = await askGroq(prompt, { expenses: [], categoryTotals: [], totalSpent: 0 });
  } catch (err) {
    aiFeedback = `Your financial health score ${scoreData.totalScore}/100 .Keep tracking your expenses!`;
  }

  return ApiResponse.success(res, {
    ...scoreData,
    aiFeedback,
  });
});

module.exports = { getHealthScore };