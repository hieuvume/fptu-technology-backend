const Article = require('../models/articleModel');
const { body, validationResult } = require('express-validator');

// Validation rules
exports.validate = (method) => {
  switch (method) {
    case 'createArticle': {
      return [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('published').notEmpty().withMessage('published is required')
      ];
    }
    case 'updateArticle': {
      return [
        body('title').optional().notEmpty().withMessage('Title is required'),
        body('content').optional().notEmpty().withMessage('Content is required'),
        body('category').optional().notEmpty().withMessage('Category is required'),
        body('published').optional().notEmpty().withMessage('published is required')
      ];
    }
  }
};

exports.getTrendingArticles = async (req, res, next) => {
  try {
    // Lấy bài viết được pinned nếu có
    let largeArticle = await Article.findOne({ pinned: true }).populate('author category');

    // Nếu không có bài viết nào được pinned, lấy bài viết có nhiều lượt views nhất
    if (!largeArticle) {
      largeArticle = await Article.findOne().sort({ views: -1 }).populate('author category');
    }

    // Lấy 3 bài viết mới nhất và có nhiều lượt views nhất, không bao gồm bài viết large
    const mediumArticles = await Article.find({ _id: { $ne: largeArticle._id } })
      .sort({ views: -1, publicationDate: -1 })
      .limit(3)
      .populate('author category');

    // Lấy 5 bài viết mới nhất và có nhiều lượt views nhất, không bao gồm bài viết large và medium
    const mediumArticleIds = mediumArticles.map(article => article._id);
    const smallArticles = await Article.find({ _id: { $nin: [largeArticle._id, ...mediumArticleIds] } })
      .sort({ views: -1, publicationDate: -1 })
      .limit(5)
      .populate('author category');

    res.json({
      large: largeArticle || {},
      medium: mediumArticles || [],
      small: smallArticles || []
    });
  } catch (err) {
    next(err);
  }
};


// Lấy danh sách tất cả các bài viết
exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().populate('author category');
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

// Lấy một bài viết theo ID
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author category');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// Lấy một bài viết theo slug
exports.getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate('author category');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách các bài viết liên quan
exports.getRelatedArticles = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      category: article.category
    }).limit(3).populate('author _id');

    res.json(relatedArticles);
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
      author: req.user.id,
      category: req.body.category,
      published: req.body.published,
      dateUpdated: new Date(),
      thumbnail: req.body.thumbnail,
      slug:req.body.slug,
      comments:req .body.comments
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
