const asyncHandler =require('../utils/asyncHandler');
const ApiResponse =require('../utils/ApiResponse');
const Budget=require('../models/Budget');
const Expense =require('../models/Expense');
const APiResponse = require('../utils/ApiResponse');

// @desc    Get all budgets
// @route   GET /api/budgets
const getBudgets = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const budgets = await Budget.find({ userId: req.user._id, month, year });

  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const result = await Expense.aggregate([
        {
          $match: {
            userId: req.user._id,
            category: budget.category,
            type: 'expense',
            date: { $gte: startDate, $lte: endDate },
          },
        },
        { $group: { _id: null, spent: { $sum: '$amount' } } },
      ]);

      const spent = result[0]?.spent || 0;
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.monthlyLimit - spent,
        percentage: Math.round((spent / budget.monthlyLimit) * 100),
      };
    })
  );

  return ApiResponse.success(res, { budgets: budgetsWithSpending });
});
// @desc    Create or update budget
// @route   POST /api/budgets
const createBudget =asyncHandler(async(req,res)=>{
    const {category,monthlyLimit,month,year}=req.body;

    const budget =await Budget.findOneAndUpdate(
        {userId:req.user._id, category,month,year},
        {monthlyLimit},
        {upsert:true,new:true,runValidators:true}
    );

    return APiResponse.success(res,{budget},"Budget saved",201);
});
// @desc    Delete budget
// @route   DELETE /api/budgets/:id
const deleteBudget=asyncHandler(async(req,res)=>{
    const budget =await Budget.findOne({_id:req.params.id,userId:req.user._id});

    if(!budget){
        res.status(404);
        throw new Error('Budget not found');
    }
    await budget.deleteOne();
    return APiResponse.success(res,{},"Budget deleted");
});
module.exports ={getBudgets,createBudget,deleteBudget};