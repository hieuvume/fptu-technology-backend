const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  commentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);