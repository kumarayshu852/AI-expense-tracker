const asyncHandler =require('../utils/asyncHandler');
const ApiResponse =require('../utils/ApiResponse');
const generateToken =require('../utils/generateToken');
const User =require('../models/User');
const APiResponse = require('../utils/ApiResponse');


// @desc    Register new user
// @route   POST /api/auth/register

const registerUser =asyncHandler(async(req,res)=>{
    const {name,email, password} =req.body;

    const userExists =await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists with this email');
    }

    const user =await User.create({name,email,password});
    const token =generateToken(user._id);

    return APiResponse.success(
        res,
        {
            user:{_id: user._id, name: user.name, email:user.email},
            token,
        },
        'User registered successfully',
        201
    );
});

// @desc    Login user
// @route   POST /api/auth/login

const loginUser =asyncHandler(async(req,res)=>{
    const {email,password} =req.body;
    
    const user =await User.findOne({email});
    if(!user || !(await user.matchPassword(password))){
        res.status(401);
        throw new Error('Invalid email or password');
    }
    
    const token =generateToken(user._id);

    return APiResponse.success(
        res,
        {
            user:{_id: user._id, name: user.name, email:user.email},
            token,
        },
        'Login successful'
    );
});

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe =asyncHandler(async(req,res)=>{
    return APiResponse.success(res,{user:req.user},'User fetched');
});


// @desc    Update profile (name, currency, avatar)
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, currency, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (currency) user.currency = currency;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return ApiResponse.success(
    res,
    { user: { _id: user._id, name: user.name, email: user.email, currency: user.currency, avatar: user.avatar } },
    'Profile updated'
  );
});

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword; // pre-save hook isko automatically hash kar dega
  await user.save();

  return ApiResponse.success(res, {}, 'Password changed successfully');
});
module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword };