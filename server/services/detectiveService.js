const Expense = require('../models/Expense');

const analyzeSpendingPatterns = async (userId) => {
  const now = new Date();

  // Current month
  const currStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Last month
  const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [currentMonthExpenses, lastMonthExpenses] = await Promise.all([
    Expense.find({ userId, type: 'expense', date: { $gte: currStart, $lte: currEnd } }),
    Expense.find({ userId, type: 'expense', date: { $gte: lastStart, $lte: lastEnd } }),
  ]);

  // ---- 1. Month over month comparison ----
  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthDiff = currentTotal - lastTotal;
  const monthDiffPercent = lastTotal > 0 ? Math.round((monthDiff / lastTotal) * 100) : 0;

  // ---- 2. Category comparison ----
  const currentCats = {};
  const lastCats = {};

  currentMonthExpenses.forEach((e) => {
    currentCats[e.category] = (currentCats[e.category] || 0) + e.amount;
  });

  lastMonthExpenses.forEach((e) => {
    lastCats[e.category] = (lastCats[e.category] || 0) + e.amount;
  });

  // Sabse zyada badhne wali categories
  const categoryChanges = Object.keys(currentCats).map((cat) => ({
    category: cat,
    current: currentCats[cat],
    last: lastCats[cat] || 0,
    diff: currentCats[cat] - (lastCats[cat] || 0),
    diffPercent: lastCats[cat]
      ? Math.round(((currentCats[cat] - lastCats[cat]) / lastCats[cat]) * 100)
      : 100,
  })).sort((a, b) => b.diff - a.diff)

  // ---- 3. Weekend vs Weekday spending ----
  const weekendSpending = currentMonthExpenses
    .filter((e) => {
      const day = new Date(e.date).getDay()
      return day === 0 || day === 6 // Sunday = 0, Saturday = 6
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const weekdaySpending = currentMonthExpenses
    .filter((e) => {
      const day = new Date(e.date).getDay()
      return day >= 1 && day <= 5
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const weekendDays = currentMonthExpenses
    .filter((e) => { const d = new Date(e.date).getDay(); return d === 0 || d === 6 })
    .map((e) => new Date(e.date).toDateString())
  const uniqueWeekendDays = new Set(weekendDays).size || 1

  const weekdayDays = currentMonthExpenses
    .filter((e) => { const d = new Date(e.date).getDay(); return d >= 1 && d <= 5 })
    .map((e) => new Date(e.date).toDateString())
  const uniqueWeekdayDays = new Set(weekdayDays).size || 1

  const avgWeekendDaily = weekendSpending / uniqueWeekendDays
  const avgWeekdayDaily = weekdaySpending / uniqueWeekdayDays

  // ---- 4. Biggest single transactions ----
  const bigTransactions = [...currentMonthExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  // ---- 5. Daily spending spikes ----
  const dailySpending = {}
  currentMonthExpenses.forEach((e) => {
    const day = new Date(e.date).toDateString()
    dailySpending[day] = (dailySpending[day] || 0) + e.amount
  })

  const dailyValues = Object.values(dailySpending)
  const avgDaily = dailyValues.length > 0
    ? dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length
    : 0

  const spikeDays = Object.entries(dailySpending)
    .filter(([, amount]) => amount > avgDaily * 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([date, amount]) => ({ date, amount }))

  return {
    currentTotal,
    lastTotal,
    monthDiff,
    monthDiffPercent,
    categoryChanges: categoryChanges.slice(0, 5),
    weekendSpending,
    weekdaySpending,
    avgWeekendDaily: Math.round(avgWeekendDaily),
    avgWeekdayDaily: Math.round(avgWeekdayDaily),
    bigTransactions,
    spikeDays,
    totalTransactions: currentMonthExpenses.length,
  }
}

module.exports = { analyzeSpendingPatterns }