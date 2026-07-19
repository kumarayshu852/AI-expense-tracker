const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { analyzePersonality } = require('../services/personalityService');
const { askGroq } = require('../services/groqService');

// Personality types define karo
const PERSONALITIES = {
  SMART_SAVER: {
    id: 'SMART_SAVER',
    name: 'Smart Saver 🏦',
    emoji: '🏦',
    color: '#10B981',
    description: 'Tum paisa wisely spend karte ho aur future ke liye bachate ho!',
  },
  FOODIE: {
    id: 'FOODIE',
    name: 'Foodie 🍔',
    emoji: '🍔',
    color: '#F97316',
    description: 'Tumhara dil khane pe aata hai — restaurants aur food delivery tumhari weakness hai!',
  },
  SHOPAHOLIC: {
    id: 'SHOPAHOLIC',
    name: 'Shopaholic 🛍️',
    emoji: '🛍️',
    color: '#EC4899',
    description: 'Shopping tumhara passion hai — sale dekho aur cart bhar lo!',
  },
  IMPULSIVE_SPENDER: {
    id: 'IMPULSIVE_SPENDER',
    name: 'Impulsive Spender ⚡',
    emoji: '⚡',
    color: '#F59E0B',
    description: 'Tum bina soche kharch karte ho — chhoti chhoti cheezein milke badi ho jaati hain!',
  },
  WEEKEND_WARRIOR: {
    id: 'WEEKEND_WARRIOR',
    name: 'Weekend Warrior 🎉',
    emoji: '🎉',
    color: '#8B5CF6',
    description: 'Weekdays pe tum seedhe rehte ho lekin weekends pe paisa udta hai!',
  },
  BALANCED_SPENDER: {
    id: 'BALANCED_SPENDER',
    name: 'Balanced Spender ⚖️',
    emoji: '⚖️',
    color: '#3B82F6',
    description: 'Tum ek balanced approach follow karte ho — na zyada bachate, na zyada kharch karte!',
  },
  INVESTOR: {
    id: 'INVESTOR',
    name: 'Investor 📈',
    emoji: '📈',
    color: '#06B6D4',
    description: 'Tumhara paisa tumhare liye kaam karta hai — investments pe dhyan dete ho!',
  },
  MINIMALIST: {
    id: 'MINIMALIST',
    name: 'Minimalist 🎯',
    emoji: '🎯',
    color: '#6B7280',
    description: 'Tum sirf zaroorat ki cheezein khareedte ho — simplicity tumhari style hai!',
  },
}

// Personality determine karo data se
const determinePersonality = (data) => {
  const scores = {
    SMART_SAVER: 0,
    FOODIE: 0,
    SHOPAHOLIC: 0,
    IMPULSIVE_SPENDER: 0,
    WEEKEND_WARRIOR: 0,
    BALANCED_SPENDER: 0,
    INVESTOR: 0,
    MINIMALIST: 0,
  }

  // Smart Saver — high savings rate
  if (data.savingsRate >= 30) scores.SMART_SAVER += 40
  else if (data.savingsRate >= 20) scores.SMART_SAVER += 25
  else if (data.savingsRate >= 10) scores.SMART_SAVER += 10

  // Foodie — Food & Dining top category
  if (data.topCategory?.name === 'Food & Dining' && data.topCategory.percent > 40) {
    scores.FOODIE += 50
  } else if (data.topCategory?.name === 'Food & Dining') {
    scores.FOODIE += 30
  }
  if (data.categoryTotals?.['Food & Dining'] || data.categoryTotals?.['Groceries']) {
    const foodTotal = (data.categoryTotals['Food & Dining'] || 0) + (data.categoryTotals['Groceries'] || 0)
    if (data.totalSpent > 0 && foodTotal / data.totalSpent > 0.35) scores.FOODIE += 20
  }

  // Shopaholic — Shopping top category
  if (data.topCategory?.name === 'Shopping' && data.topCategory.percent > 35) {
    scores.SHOPAHOLIC += 50
  } else if (data.categoryTotals?.['Shopping'] && data.totalSpent > 0) {
    const shopPercent = data.categoryTotals['Shopping'] / data.totalSpent
    if (shopPercent > 0.25) scores.SHOPAHOLIC += 30
  }

  // Impulsive Spender — bahut saare small transactions
  if (data.impulsiveRatio > 0.6) scores.IMPULSIVE_SPENDER += 50
  else if (data.impulsiveRatio > 0.4) scores.IMPULSIVE_SPENDER += 30
  if (data.transactionCount > 30) scores.IMPULSIVE_SPENDER += 20

  // Weekend Warrior — weekend pe zyada kharch
  if (data.weekendRatio > 0.5) scores.WEEKEND_WARRIOR += 50
  else if (data.weekendRatio > 0.35) scores.WEEKEND_WARRIOR += 30

  // Investor — Investment category mein kharch
  if (data.categoryTotals?.['Investment'] && data.totalSpent > 0) {
    const investPercent = data.categoryTotals['Investment'] / data.totalSpent
    if (investPercent > 0.2) scores.INVESTOR += 50
    else if (investPercent > 0.1) scores.INVESTOR += 30
  }

  // Minimalist — kam transactions, diverse categories
  if (data.transactionCount < 10 && data.categoryCount >= 4) scores.MINIMALIST += 40
  else if (data.transactionCount < 15) scores.MINIMALIST += 20

  // Balanced Spender — no extreme category, moderate savings
  if (data.topCategory?.percent < 35 && data.savingsRate > 5 && data.savingsRate < 25) {
    scores.BALANCED_SPENDER += 40
  }
  if (data.categoryCount >= 5) scores.BALANCED_SPENDER += 20

  // Winner — highest score
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  const secondWinner = Object.entries(scores).sort((a, b) => b[1] - a[1])[1]

  return {
    primary: PERSONALITIES[winner[0]],
    secondary: PERSONALITIES[secondWinner[0]],
    scores,
  }
}

// @desc    Get spending personality
// @route   GET /api/personality
const getPersonality = asyncHandler(async (req, res) => {
  const data = await analyzePersonality(req.user._id)
  const { primary, secondary, scores } = determinePersonality(data)

  // Groq se personalized tips generate karo
  const prompt = `
You are a fun financial personality advisor. The user's spending personality is "${primary.name}".

Their data:
- Savings Rate: ${Math.round(data.savingsRate)}%
- Top Category: ${data.topCategory?.name || 'N/A'} (${data.topCategory?.percent || 0}%)
- Weekend Spending Ratio: ${Math.round(data.weekendRatio * 100)}%
- Total Transactions: ${data.transactionCount}
- Secondary Personality: ${secondary.name}

Write a SHORT fun personality analysis in Hinglish (3-4 lines):
1. Confirm their personality type in an engaging way
2. One fun observation about their spending
3. One actionable tip specific to their personality

Be playful, like a fun friend giving financial advice. Keep it under 4 lines.
`

  let aiTips = ''
  try {
    aiTips = await askGroq(prompt, { expenses: [], categoryTotals: [], totalSpent: 0 })
  } catch (err) {
    aiTips = `Tumhara personality type "${primary.name}" hai! ${primary.description}`
  }

  return ApiResponse.success(res, {
    primary,
    secondary,
    data,
    aiTips,
  })
})

module.exports = { getPersonality }