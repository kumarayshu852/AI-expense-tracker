const express =require('express');
const router=express.Router();
const {body}=require('express-validator');
const goalController =require('../controllers/goalController');
const {protect} =require('../middleware/authMiddleware');
const validate =require('../middleware/validate')


router.use(protect);

router.get('/',goalController.getGoals);

router.post(
    '/',
    [body('title').trim().notEmpty().withMessage('Title is required'),
    body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be at least 1'),
    body('deadline').isISO8601().withMessage('Valid deadline is required'),
    body('icon').optional().isString(),
    body('color').optional().isString(),
],
validate,
goalController.createGoal
);

router.put(
    '/:id/add',
    [
        body('amount').isFloat({min:1}).withMessage("Amount must be at least 1")
    ],
    validate,
    goalController.addToGoal
);

router.put('/:id',goalController.updateGoal);
router.delete('/:id',goalController.deleteGoal)

module.exports=router;
