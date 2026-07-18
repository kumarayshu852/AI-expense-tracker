const mongoose =require('mongoose');

const goalSchema =new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        title:{
            type:String,
            required:[true,"Goal title is required"],
            trim:true,
            maxlength:[100,"Title cannot exceed 100 characters"],
        },
        targetAmount:{
            type:Number,
            required:[true,"Target amount is required"],
            min:[1,"Target amount must be at least 1"],
        },
        savedAmount:{
            type:Number,
            default:0,
            min:[0,'Saved amount cannot be negative'],
        },
        deadline:{
            type:Date,
            required:[true,"Deadline is required"],
        },
        icon:{
            type:String,
            default:"Target",
        },
        color:{
            type: String,
            default: '#8B5CF6',
        },
        icCompleted:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);

goalSchema.index({userId: 1, isCompleted: 1});

module.exports =mongoose.model('Goal',goalSchema);