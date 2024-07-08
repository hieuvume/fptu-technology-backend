const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  example: { type: String, required: true },
  description: { type: String, required: true },
  social_links: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);