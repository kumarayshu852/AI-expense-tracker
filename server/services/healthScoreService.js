const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// Score calculate karne ka pure logic yahan hai
const calculateHealthScore = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Is mahine ki saari expenses fetch karo
  const expenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const budgets = await Budget.find({ userId, month, year });

  // ---- Factor 1: Savings Rate (30 points) ----
  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  let savingsScore = 0;
  let savingsRate = 0;

  if (totalIncome > 0) {
    savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    if (savingsRate >= 30) savingsScore = 30;
    else if (savingsRate >= 20) savingsScore = 25;
    else if (savingsRate >= 10) savingsScore = 15;
    else if (savingsRate >= 0) savingsScore = 8;
    else savingsScore = 0; // Negative savings
  } else {
    savingsScore = 10; // Income data nahi hai, neutral score
  }

  // ---- Factor 2: Budget Adherence (25 points) ----
  let budgetScore = 0;

  if (budgets.length > 0) {
    const categorySpending = {};
    expenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
      });

    let withinBudget = 0;
    budgets.forEach((b) => {
      const spent = categorySpending[b.category] || 0;
      if (spent <= b.monthlyLimit) withinBudget++;
    });

    const adherenceRate = (withinBudget / budgets.length) * 100;
    budgetScore = Math.round((adherenceRate / 100) * 25);
  } else {
    budgetScore = 10; // Budget set nahi kiya, partial score
  }

  // ---- Factor 3: Spending Consistency (20 points) ----
  // Daily spending ka standard deviation check karo
  let consistencyScore = 20;

  const dailySpending = {};
  expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      const day = new Date(e.date).toDateString();
      dailySpending[day] = (dailySpending[day] || 0) + e.amount;
    });

  const dailyAmounts = Object.values(dailySpending);

  if (dailyAmounts.length > 3) {
    const avg = dailyAmounts.reduce((a, b) => a + b, 0) / dailyAmounts.length;
    const variance = dailyAmounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / dailyAmounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = avg > 0 ? (stdDev / avg) * 100 : 0;

    if (coefficientOfVariation < 50) consistencyScore = 20;
    else if (coefficientOfVariation < 100) consistencyScore = 14;
    else if (coefficientOfVariation < 150) consistencyScore = 8;
    else consistencyScore = 4;
  }

  // ---- Factor 4: Category Diversity (15 points) ----
  // Saara paisa ek category pe toh nahi ja raha?
  const categoryTotals = {};
  expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  let diversityScore = 15;

  if (totalExpense > 0 && Object.keys(categoryTotals).length > 0) {
    const maxCategoryPercent = Math.max(...Object.values(categoryTotals)) / totalExpense * 100;

    if (maxCategoryPercent > 70) diversityScore = 5;
    else if (maxCategoryPercent > 50) diversityScore = 10;
    else diversityScore = 15;
  }

  // ---- Factor 5: Data Completeness (10 points) ----
  // User ne data properly enter kiya hai?
  let completenessScore = 0;
  if (expenses.length >= 10) completenessScore = 10;
  else if (expenses.length >= 5) completenessScore = 7;
  else if (expenses.length >= 1) completenessScore = 4;

  // ---- Final Score ----
  const totalScore = Math.min(
    100,
    savingsScore + budgetScore + consistencyScore + diversityScore + completenessScore
  );

  // Grade
  let grade, gradeColor;
  if (totalScore >= 85) { grade = 'A'; gradeColor = '#10B981'; }
  else if (totalScore >= 70) { grade = 'B'; gradeColor = '#3B82F6'; }
  else if (totalScore >= 55) { grade = 'C'; gradeColor = '#F59E0B'; }
  else if (totalScore >= 40) { grade = 'D'; gradeColor = '#F97316'; }
  else { grade = 'F'; gradeColor = '#EF4444'; }

  return {
    totalScore,
    grade,
    gradeColor,
    breakdown: {
      savingsScore: { score: savingsScore, max: 30, label: 'Savings Rate', value: `${Math.round(savingsRate)}%` },
      budgetScore: { score: budgetScore, max: 25, label: 'Budget Adherence', value: `${budgets.length} budgets` },
      consistencyScore: { score: consistencyScore, max: 20, label: 'Spending Consistency' },
      diversityScore: { score: diversityScore, max: 15, label: 'Category Diversity' },
      completenessScore: { score: completenessScore, max: 10, label: 'Data Completeness', value: `${expenses.length} entries` },
    },
    rawData: {
      totalIncome,
      totalExpense,
      savingsRate: Math.round(savingsRate),
      totalBudgets: budgets.length,
      totalTransactions: expenses.length,
      categoryCount: Object.keys(categoryTotals).length,
    },
  };
};

module.exports = { calculateHealthScore };