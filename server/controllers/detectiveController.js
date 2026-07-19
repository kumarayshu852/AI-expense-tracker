const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { analyzeSpendingPatterns } = require('../services/detectiveService');
const { askGroq } = require('../services/groqService');

// @desc    Get spending detective analysis
// @route   GET /api/detective
const getDetectiveAnalysis = asyncHandler(async (req, res) => {
  const patterns = await analyzeSpendingPatterns(req.user._id);

  // Groq se detective-style analysis generate karo
  const prompt = `
You are a witty financial detective named "Paisa Detective". Analyze this user's spending data and write a SHORT detective-style report in Hinglish (mix of Hindi and English). Be fun, engaging and like a real detective solving a case.

SPENDING DATA:
- This month total: ₹${patterns.currentTotal.toLocaleString('en-IN')}
- Last month total: ₹${patterns.lastTotal.toLocaleString('en-IN')}
- Month difference: ${patterns.monthDiff >= 0 ? '+' : ''}₹${patterns.monthDiff.toLocaleString('en-IN')} (${patterns.monthDiffPercent}%)
- Weekend spending: ₹${patterns.weekendSpending.toLocaleString('en-IN')} (avg ₹${patterns.avgWeekendDaily}/day)
- Weekday spending: ₹${patterns.weekdaySpending.toLocaleString('en-IN')} (avg ₹${patterns.avgWeekdayDaily}/day)

Top category changes this month vs last month:
${patterns.categoryChanges.map((c) => `- ${c.category}: ₹${c.current.toLocaleString('en-IN')} (${c.diffPercent > 0 ? '+' : ''}${c.diffPercent}%)`).join('\n')}

Biggest transactions:
${patterns.bigTransactions.map((t) => `- ${t.title}: ₹${t.amount.toLocaleString('en-IN')} (${t.category})`).join('\n')}

Spending spike days:
${patterns.spikeDays.length > 0 ? patterns.spikeDays.map((s) => `- ${s.date}: ₹${s.amount.toLocaleString('en-IN')}`).join('\n') : 'No major spikes detected'}

Write a detective report with:
1. Opening line like "Case File: Kahan Gaya Paisa?" 
2. Key finding (biggest change or pattern)
3. Suspect (the main spending category)
4. One actionable tip
Keep it under 6 lines, fun and engaging!
`;

  let analysis = '';
  try {
    analysis = await askGroq(prompt, { expenses: [], categoryTotals: [], totalSpent: 0 });
  } catch (err) {
    analysis = `Case File: Kahan Gaya Paisa? 🔍\nIs mahine tumne ₹${patterns.currentTotal.toLocaleString('en-IN')} kharch kiye. Investigation jaari hai...`;
  }

  return ApiResponse.success(res, {
    patterns,
    analysis,
  });
});

module.exports = { getDetectiveAnalysis };