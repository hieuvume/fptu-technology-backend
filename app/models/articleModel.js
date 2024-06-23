const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  thumbnail: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  published: { type: Boolean, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  pinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  publicationDate: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Article', articleSchema);