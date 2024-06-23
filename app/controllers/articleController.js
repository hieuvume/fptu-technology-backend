const Article = require('../models/articleModel');
const { body, validationResult } = require('express-validator');

// Validation rules
exports.validate = (method) => {
  switch (method) {
    case 'createArticle': {
      return [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('category_id').notEmpty().withMessage('Category is required'),
        body('published').notEmpty().withMessage('published is required')
      ];
    }
    case 'updateArticle': {
      return [
        body('title').optional().notEmpty().withMessage('Title is required'),
        body('content').optional().notEmpty().withMessage('Content is required'),
        body('category_id').optional().notEmpty().withMessage('Category is required'),
        body('published').optional().notEmpty().withMessage('published is required')
      ];
    }
  }
};

// Lấy danh sách tất cả các bài viết
exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().populate('author_id category_id');
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

// Lấy một bài viết theo ID
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author_id category_id');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// Tạo một bài viết mới
exports.createArticle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      publicationDate: new Date(),
      author_id: req.user.id,
      category_id: req.body.category_id,
      published: req.body.published,
      dateUpdated: new Date(),
      thumbnail: req.body.thumbnail,
      slug:req.body.slug

    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    next(err);
  }
};

// Cập nhật một bài viết
exports.updateArticle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
      ...req.body,
      dateUpdated: new Date()
    }, { new: true });

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(updatedArticle);
  } catch (err) {
    next(err);
  }
};

// Xóa một bài viết
exports.deleteArticle = async (req, res, next) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
