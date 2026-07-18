const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Goal = require('../models/Goal');

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });

  // Har goal ke liye progress calculate karo
  const goalsWithProgress = goals.map((goal) => {
    const percentage = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)
    const remaining = goal.targetAmount - goal.savedAmount
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    const isOverdue = daysLeft < 0 && !goal.isCompleted

    // Monthly saving needed calculate karo
    const monthsLeft = Math.max(daysLeft / 30, 0)
    const monthlyNeeded = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining

    return {
      ...goal.toObject(),
      percentage,
      remaining,
      daysLeft,
      isOverdue,
      monthlyNeeded,
    }
  })

  return ApiResponse.success(res, { goals: goalsWithProgress })
})

// @desc    Create goal
// @route   POST /api/goals
const createGoal = asyncHandler(async (req, res) => {
  const { title, targetAmount, deadline, icon, color } = req.body

  const goal = await Goal.create({
    userId: req.user._id,
    title,
    targetAmount,
    deadline,
    icon: icon || 'Target',
    color: color || '#8B5CF6',
  })

  return ApiResponse.success(res, { goal }, 'Goal created', 201)
})

// @desc    Add money to goal (manually)
// @route   PUT /api/goals/:id/add
const addToGoal = asyncHandler(async (req, res) => {
  const { amount } = req.body

  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id })

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  goal.savedAmount = Math.min(goal.savedAmount + Number(amount), goal.targetAmount)

  // Auto complete karo agar target reach ho gaya
  if (goal.savedAmount >= goal.targetAmount) {
    goal.isCompleted = true
  }

  await goal.save()
  return ApiResponse.success(res, { goal }, 'Amount added to goal')
})

// @desc    Update goal
// @route   PUT /api/goals/:id
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id })

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  const { title, targetAmount, deadline, icon, color } = req.body

  if (title) goal.title = title
  if (targetAmount) goal.targetAmount = Number(targetAmount)
  if (deadline) goal.deadline = deadline
  if (icon) goal.icon = icon
  if (color) goal.color = color

  await goal.save()
  return ApiResponse.success(res, { goal }, 'Goal updated')
})

// @desc    Delete goal
// @route   DELETE /api/goals/:id
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id })

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  await goal.deleteOne()
  return ApiResponse.success(res, {}, 'Goal deleted')
})

module.exports = { getGoals, createGoal, addToGoal, updateGoal, deleteGoal }