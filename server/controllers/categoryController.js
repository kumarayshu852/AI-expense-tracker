const asyncHandler = require('../utils/asyncHandler');
const APiResponse = require('../utils/ApiResponse');
const Category = require('../models/Category');

// default categories -yeh hamesha available rahengem user sabke liye

const DEFAULT_CATEGORIES = [
    { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316', isDefault: true },
    { name: 'Groceries', icon: 'Carrot', color: '#84cc16', isDefault: true },
    { name: 'Transport', icon: 'Car', color: '#3b82f6', isDefault: true },
    { name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', isDefault: true },
    { name: 'Bills & Utilities', icon: 'Lightbulb', color: '#eab308', isDefault: true },
    { name: 'Entertainment', icon: 'Clapperboard', color: '#a855f7', isDefault: true },
    { name: 'Health', icon: 'HeartPulse', color: '#ef4444', isDefault: true },
    { name: 'Education', icon: 'BookOpen', color: '#06b6d4', isDefault: true },
    { name: 'Travel', icon: 'Plane', color: '#0ea5e9', isDefault: true },
    { name: 'Investment', icon: 'TrendingUp', color: '#22c55e', isDefault: true },
    { name: 'Loans & Lending', icon: 'HandCoins', color: '#f59e0b', isDefault: true },
    { name: 'Personal & Lifestyle', icon: 'Sparkles', color: '#d946ef', isDefault: true },
    { name: 'Income', icon: 'Wallet', color: '#10b981', isDefault: true },
    { name: 'Others', icon: 'Package', color: '#6b7280', isDefault: true },
];


// @desx get all categories (default + user ki custom)
// #route get/ api/categories
const getCategories = asyncHandler(async(req,res)=>{
    // User ki custom categories fetch karo
    const userCategories =await Category.find({userId:req.user._id});

    // Default + custom dono milake bhejo
    const all =[
    ...DEFAULT_CATEGORIES,
    ...userCategories.map((c) => ({
      _id: c._id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      isDefault: false,
    })),
    ];

    return APiResponse.success(res,{categories:all});

});

// @desc create custom category
// @route Post /api/categories

const createCategory =asyncHandler(async(req,res)=>{
    const {name,icon,color}=req.body;

    // default category ke naam se  conflict check karo
    const isDefaultName = DEFAULT_CATEGORIES.some(
        (c)=> c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (isDefaultName){
        res.status(400);
        throw new Error('This category name already exists.');
    }

    const category =await Category.create({
        userId: req.user._id,
        name,
        icon: icon || 'Package',
        color: color || '#8B5CF6',
        isDefault: false,
    });

    return APiResposne.success(res,{category},"Category created",201);
});

// @desc delete custom category
// @route delete /api/categories/:id
const deleteCategory =asyncHandler(async(req,res)=>{
    const category =await Category.findOne({_id:req.params.id,userId:req.user._id});

    if(!category){
        res.status(404);
        throw new Error('Category not found or not authorized');
    }

    await category.deleteOne();
    return APiResponse.success(res,{},"Category deleted");
});

module.exports ={getCategories, createCategory, deleteCategory};