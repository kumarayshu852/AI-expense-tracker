const Expense = require('../models/Expense');

const getDashboardStats = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const result = await Expense.aggregate([
    { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  const income = result.find((r) => r._id === 'income')?.total || 0;
  const expenses = result.find((r) => r._id === 'expense')?.total || 0;

  return {
    totalIncome: income,
    totalExpenses: expenses,
    savings: income - expenses,
  };
};

const getCategoryBreakdown = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await Expense.aggregate([
    { $match: { userId, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
};

const getDailyTrend = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await Expense.aggregate([
    { $match: { userId, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getAIContext = async (userId) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const expenses = await Expense.find({ userId, date: { $gte: threeMonthsAgo } })
    .sort({ date: -1 })
    .limit(100)
    .lean();

  const categoryTotals = await Expense.aggregate([
    { $match: { userId, type: 'expense', date: { $gte: threeMonthsAgo } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);

  const totalSpent = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  return { expenses, categoryTotals, totalSpent };
};

module.exports = { getDashboardStats, getCategoryBreakdown, getDailyTrend, getAIContext };