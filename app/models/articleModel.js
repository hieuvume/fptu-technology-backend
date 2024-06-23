const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  thumbnail: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  pinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  publicationDate: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Article', articleSchema);