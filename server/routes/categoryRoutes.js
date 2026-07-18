const express =require('express');
const router =express.Router();
const {body} =require('express-validator');
const {getCategories, createCategory, deleteCategory}=require('../controllers/categoryController');
const {protect}=require('../middleware/authMiddleware');
const validate =require('../middleware/validate');


router.use(protect);

router.get('/',getCategories);

router.post(
    '/',
     [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('color').optional().isString(),
    body('icon').optional().isString(),
  ],
  validate,
  createCategory
);

router.delete('/:id',deleteCategory);
module.exports=router;