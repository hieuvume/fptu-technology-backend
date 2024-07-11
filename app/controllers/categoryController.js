const { body, validationResult } = require('express-validator');
const Category = require('../models/categoryModel');
const Article = require('../models/articleModel');

// Validation rules
exports.validate = (method) => {
  switch (method) {
    case 'createCategory': {
      return [
        body('categoryName').notEmpty().withMessage('Category name is required'),
        body('description').notEmpty().withMessage('Description is required')
      ];
    }
    case 'updateCategory': {
      return [
        body('categoryName').optional().notEmpty().withMessage('Category name is required'),
        body('description').optional().notEmpty().withMessage('Description is required')
      ];
    }
  }
};

// Lấy danh sách tất cả các category
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('articles');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// lấy danh sách bài viết theo category
exports.getArticlesByCategory = async (req, res, next) => {
  try {
    const articles = await Article.find({ category: req.params.id }).populate('author category');
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

// Lấy một category theo ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Tạo một category mới
exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    next(err);
  }
};

// Cập nhật một category
exports.updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    next(err);
  }
};

// Xóa một category
exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
exports.getdata=async(req,res,next) => {
  try{
    res.status(200).json({
      message:"succse"
    })
  }catch(err){
    next(err)
  }
}
