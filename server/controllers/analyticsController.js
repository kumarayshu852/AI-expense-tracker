const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { getDashboardStats, getCategoryBreakdown, getDailyTrend } = require('../services/analyticsService');

const dashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const stats = await getDashboardStats(req.user._id, month, year);
  return ApiResponse.success(res, stats);
});

const categoryBreakdown = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const data = await getCategoryBreakdown(req.user._id, month, year);
  return ApiResponse.success(res, { categories: data });
});

const dailyTrend = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const data = await getDailyTrend(req.user._id, month, year);
  return ApiResponse.success(res, { trend: data });
});

module.exports = { dashboardStats, categoryBreakdown, dailyTrend };