const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  console.log('getAllUsers')
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
