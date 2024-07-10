const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
  description: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Category', categorySchema);
