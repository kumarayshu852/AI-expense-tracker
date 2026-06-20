const asyncHandler =require('../utils/asyncHandler');
const APiResponse =require('../utils/ApiResponse');
const Expense=require('../models/Expense');


// @desc    Get all expenses
// @route   GET /api/expenses
const getExpenses =asyncHandler(async(req,res)=>{
    const {page=1,limit=20,category,type,startDate,endDate, search}=req.query;

    const filter={userId: req.user._id};

    if(category) filter.category =category;
    if(type) filter.type=type;
    if(startDate || endDate){
        filter.date={};
        if(startDate) filter.date.$gte=new Date(startDate);
        if(endDate) filter.date.$lte=new Date(endDate);
    }
    if(search) filter.title ={$regex:search,$options: "i"};

    const total =await Expense.countDocuments(filter);
    const expenses =await Expense.find(filter)
    .sort({date: -1})
    .skip((page -1)*limit)
    .limit(Number(limit));

    return APiResponse.success(res,{
        expenses,
        pagination: {total, page:Number(page), pages:Math.ceil(total/limit)},
    });
});

// @desc    Create expense
// @route   POST /api/expenses

const createExpense =asyncHandler(async(req,res)=>{
    const {title,amount,type,category,paymentMethod,notes,date}=req.body;

    const expense =await Expense.create({
        userId:req.user._id,
        title,
        amount,
        type,
        category,
        paymentMethod,
        notes,
        date,
    });
    return APiResponse.success(res,{expense},"Expense created",201);
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
const updateExpense =asyncHandler(async(req,res)=>{
    const expense=await Expense.findOne({_id:req.params.id,userId: req.user._id});

    if(!expense){
        res.status(404);
        throw new Error('Expense not found');
    }
    const updated =await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true, runValidators:true}
    );

    return APiResponse.success(res,{expense:updated},'Expense updated');
});
//@desc    Delete expense
// @route   DELETE /api/expenses/:id
const deleteExpense =asyncHandler(async(req,res)=>{
    const expense =await Expense.findOne({_id:req.params.id,userId:req.user._id});

    if(!expense){
        res.status(404);
        throw new Error('Expense not found');
    }
    await expense.deleteOne();
    return APiResponse.success(res,{},'Expense deleted');
});
// @desc    Get single expense
// @route   GET /api/expenses/:id
const getExpenseById =asyncHandler(async(req,res)=>{
    const expense =await Expense.findOne({_id:req.params.id,userId:req.user._id});

    if(!expense){
        res.status(404);
        throw new Error('Expense not found');
    }

    return APiResponse.success(res,{expense});
});
module.exports ={getExpenses,createExpense,updateExpense,deleteExpense,getExpenseById}