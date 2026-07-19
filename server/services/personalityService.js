const Expense = require('../models/Expense');

const analyzePersonality = async (userId) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const expenses = await Expense.find({
    userId,
    type: 'expense',
    date: { $gte: startDate, $lte: endDate },
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category totals
  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Weekend spending
  const weekendSpent = expenses
    .filter((e) => { const d = new Date(e.date).getDay(); return d === 0 || d === 6 })
    .reduce((sum, e) => sum + e.amount, 0);

  const weekendRatio = totalSpent > 0 ? weekendSpent / totalSpent : 0;

  // Transaction frequency (impulsive = bahut saare small transactions)
  const avgTransactionAmount = totalSpent / (expenses.length || 1);
  const smallTransactions = expenses.filter((e) => e.amount < avgTransactionAmount * 0.5).length;
  const impulsiveRatio = expenses.length > 0 ? smallTransactions / expenses.length : 0;

  // Top category percentage
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
  const topCategoryPercent = topCategory && totalSpent > 0
    ? (topCategory[1] / totalSpent) * 100
    : 0;

  // Income data
  const incomeExpenses = await Expense.find({
    userId,
    type: 'income',
    date: { $gte: startDate, $lte: endDate },
  });
  const totalIncome = incomeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

  return {
    totalSpent,
    totalIncome,
    savingsRate,
    categoryTotals,
    topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1], percent: Math.round(topCategoryPercent) } : null,
    weekendRatio,
    impulsiveRatio,
    transactionCount: expenses.length,
    avgTransactionAmount: Math.round(avgTransactionAmount),
    categoryCount: Object.keys(categoryTotals).length,
  };
};

module.exports = { analyzePersonality };