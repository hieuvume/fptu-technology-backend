const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  role: { type: String, required: true },
  dateRegistered: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('User', userSchema);