const express =require('express');
const cors =require('cors');
const helemet =require('helmet');
const morgan =require('morgan');
const cookieParser =require('cookie-parser');
const rateLimit =require('express-rate-limit');


const authRoutes =require('./routes/authRoutes');
const expenseRoutes =require('./routes/expenseRoutes');
const budgetRoutes=require('./routes/budgetRoutes');
const analyticsRoutes=require('./routes/analyticsRoutes')
const aiRoutes =require('./routes/aiRoutes')
const {errorHandler, notFound} =require('./middleware/errorMiddleware')

const app=express();

app.use(helemet());
app.use(cors({
    origin: process.env.CLIENT_URL ||  'http://localhost:5173',
    credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 मिनट
  max: 100, // हर IP से अधिकतम 100 रिक्वेस्ट
  standardHeaders: true, // v6+ के लिए अनुशंसित
  legacyHeaders: false, 
});
app.use('/api',limiter);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth',authRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/budgets',budgetRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/ai',aiRoutes);

app.get('/api/health',(req,res)=>{
    res.json({success:true,message:'server is running'});
});

app.use(notFound);
app.use(errorHandler);

module.exports =app;