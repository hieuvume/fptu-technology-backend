const Comment = require('../models/commentModel');
const { body, validationResult } = require('express-validator');
const Article = require('../models/articleModel'); 
const User = require('../models/userModel'); 
// Validation rules
exports.validate = (method) => {
  switch (method) {
    case 'createComment': {
      return [
        body('commentText').notEmpty().withMessage('Comment text is required'),
        body('article_id').notEmpty().withMessage('Article ID is required')
      ];
    }
    case 'updateComment': {
      return [
        body('commentText').optional().notEmpty().withMessage('Comment text is required')
      ];
    }
  }
};


exports.getAllComments = async (req, res, next) => {
    try {
      const comments = await Comment.find()
        .populate({
          path: 'article_id',
          select: '_id title'
        })
        .populate({
          path: 'user_id',
          select: '_id fullName'
        })
        .select('_id article_id user_id commentText commentDate');
  
      res.json(comments);
    } catch (err) {
      next(err);
    }
  };

// Lấy bình luận theo Article ID
exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const comments = await Comment.find({ article_id: req.params.article_id }).populate('user_id');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Lấy bình luận theo ID của article
exports.getCommentById = async (req, res, next) => {
  try {
    const comments = await Comment.find({ article_id: req.params.id }).populate('user_id');
    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this article ID' });
    }
    res.json(comments);
  } catch (err) {
    next(err);
  }
};


// Lấy bình luận theo Article ID
exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const comments = await Comment.find({ article_id: req.params.article_id }).populate('user_id');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};



// Tạo bình luận mới
// exports.createComment = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // Lấy thông tin người dùng từ req.user đã được thiết lập trong middleware verifyToken
//     const user = req.user;

//     const newComment = new Comment({
//       article_id: req.body.article_id, // Nếu cần, bạn có thể thêm article_id tại đây
//       user_id: user._id,
//       commentText: req.body.commentText
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (err) {
//     next(err);
//   }
// };

exports.createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Lấy thông tin người dùng từ req.user đã được thiết lập trong middleware verifyToken
    const user = req.user;

    // Tạo mới đối tượng Comment từ req.body và thông tin user_id đã lấy
    const newComment = new Comment({
      article_id: req.body.article_id, // Nếu cần, bạn có thể thêm article_id tại đây
      user_id: user._id,
      commentText: req.body.commentText
    });

    // Lưu comment vào cơ sở dữ liệu
    const savedComment = await newComment.save();

    // Trả về kết quả thành công
    res.status(201).json(savedComment);
  } catch (err) {
    // Xử lý lỗi nếu có
    next(err);
  }
};

// Cập nhật bình luận
exports.updateComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
      ...req.body,
      commentDate: new Date()
    }, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res, next) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
