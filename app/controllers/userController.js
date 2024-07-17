const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
        body('role').notEmpty().withMessage('Role is required'),
      ];
    }
    case 'updateUser': {
      return [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
        body('role').notEmpty().withMessage('Role is required'),
      ];
    }
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ dateRegistered: -1 });
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

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, dateOfBirth, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth,
      role,
      dateRegistered: new Date(),
      dateUpdated: new Date()
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Kiểm tra nếu người dùng không phải admin và không phải là chủ tài khoản
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { username, email, fullName, dateOfBirth, role } = req.body;

    const updateData = {
      username,
      email,
      fullName,
      dateOfBirth,
      role,
      dateUpdated: new Date()
    };

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

// banned user

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: false }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}