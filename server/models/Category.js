const mongoose =require('mongoose');


const categorySchema =new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // =default category (sab ke liye)
        },
        name: {
            type:String,
            required:[true,'Category name is required'],
            trim:true,
            maxlength:[30,'Category name cannot exceed 30 characters'],
        },
        icon:{
            type:String,
            default:'Package' //lucide-react-icon name
        },
        color:{
            type:String,
            default:"#8B5CF6",
        },
        isDefault:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);
// Ek user ek naam ki category ek baar hi bana sakta hai
categorySchema.index({ userId: 1, name: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Category', categorySchema);