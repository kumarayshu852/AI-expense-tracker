const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const BillSplit = require('../models/BillSplit');

// Minimum transactions mein settle karne ka algorithm
const calculateSettlement = (members, expenses) => {
  // Har member ka balance calculate karo (positive = paisa milna hai, negative = dena hai)
  const balances = {}
  members.forEach((m) => { balances[m.name] = 0 })

  expenses.forEach((exp) => {
    const splitCount = exp.splitAmong.length
    if (splitCount === 0) return

    const perPerson = exp.amount / splitCount

    // Jo pay kiya use credit do
    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount

    // Jo split mein hain unhe debit karo
    exp.splitAmong.forEach((member) => {
      balances[member] = (balances[member] || 0) - perPerson
    })
  })

  // Minimum transactions algorithm
  const settlements = []
  const creditors = [] // jinhe paisa milna hai
  const debtors = [] // jinhe paisa dena hai

  Object.entries(balances).forEach(([name, balance]) => {
    if (balance > 0.01) creditors.push({ name, amount: balance })
    else if (balance < -0.01) debtors.push({ name, amount: Math.abs(balance) })
  })

  // Greedy approach — sabse bada debtor sabse bade creditor ko pay kare
  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  let i = 0, j = 0
  while (i < creditors.length && j < debtors.length) {
    const creditAmount = creditors[i].amount
    const debtAmount = debtors[j].amount
    const settleAmount = Math.min(creditAmount, debtAmount)

    if (settleAmount > 0.01) {
      settlements.push({
        from: debtors[j].name,
        to: creditors[i].name,
        amount: Math.round(settleAmount * 100) / 100,
      })
    }

    creditors[i].amount -= settleAmount
    debtors[j].amount -= settleAmount

    if (creditors[i].amount < 0.01) i++
    if (debtors[j].amount < 0.01) j++
  }

  return { balances, settlements }
}

// @desc    Get all bill splits
// @route   GET /api/billsplit
const getBillSplits = asyncHandler(async (req, res) => {
  const splits = await BillSplit.find({ userId: req.user._id }).sort({ createdAt: -1 })
  return ApiResponse.success(res, { splits })
})

// @desc    Get single bill split with settlement
// @route   GET /api/billsplit/:id
const getBillSplitById = asyncHandler(async (req, res) => {
  const split = await BillSplit.findOne({ _id: req.params.id, userId: req.user._id })

  if (!split) {
    res.status(404)
    throw new Error('Bill split not found')
  }

  const { balances, settlements } = calculateSettlement(split.members, split.expenses)

  const totalAmount = split.expenses.reduce((sum, e) => sum + e.amount, 0)

  return ApiResponse.success(res, { split, balances, settlements, totalAmount })
})

// @desc    Create bill split group
// @route   POST /api/billsplit
const createBillSplit = asyncHandler(async (req, res) => {
  const { title, members } = req.body

  const split = await BillSplit.create({
    userId: req.user._id,
    title,
    members: members.map((name) => ({ name })),
  })

  return ApiResponse.success(res, { split }, 'Bill split group created', 201)
})

// @desc    Add expense to bill split
// @route   POST /api/billsplit/:id/expense
const addExpense = asyncHandler(async (req, res) => {
  const { title, amount, paidBy, splitAmong } = req.body

  const split = await BillSplit.findOne({ _id: req.params.id, userId: req.user._id })

  if (!split) {
    res.status(404)
    throw new Error('Bill split not found')
  }

  split.expenses.push({ title, amount: Number(amount), paidBy, splitAmong })
  await split.save()

  return ApiResponse.success(res, { split }, 'Expense added')
})

// @desc    Remove expense from bill split
// @route   DELETE /api/billsplit/:id/expense/:expenseId
const removeExpense = asyncHandler(async (req, res) => {
  const split = await BillSplit.findOne({ _id: req.params.id, userId: req.user._id })

  if (!split) {
    res.status(404)
    throw new Error('Bill split not found')
  }

  split.expenses = split.expenses.filter(
    (e) => e._id.toString() !== req.params.expenseId
  )
  await split.save()

  return ApiResponse.success(res, { split }, 'Expense removed')
})

// @desc    Mark as settled
// @route   PUT /api/billsplit/:id/settle
const settleBillSplit = asyncHandler(async (req, res) => {
  const split = await BillSplit.findOne({ _id: req.params.id, userId: req.user._id })

  if (!split) {
    res.status(404)
    throw new Error('Bill split not found')
  }

  split.isSettled = true
  await split.save()

  return ApiResponse.success(res, { split }, 'Bill split settled!')
})

// @desc    Delete bill split
// @route   DELETE /api/billsplit/:id
const deleteBillSplit = asyncHandler(async (req, res) => {
  const split = await BillSplit.findOne({ _id: req.params.id, userId: req.user._id })

  if (!split) {
    res.status(404)
    throw new Error('Bill split not found')
  }

  await split.deleteOne()
  return ApiResponse.success(res, {}, 'Bill split deleted')
})

module.exports = {
  getBillSplits,
  getBillSplitById,
  createBillSplit,
  addExpense,
  removeExpense,
  settleBillSplit,
  deleteBillSplit,
}