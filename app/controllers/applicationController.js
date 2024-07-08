const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'sendApplication': {
      return [
        body('specialty').notEmpty().withMessage('Specialty is required'),
        body('experience').notEmpty().withMessage('Experience is required'),
        body('example').notEmpty().withMessage('Article example is required'),
        body('description').notEmpty().withMessage('Briefly describe yourself is required'),
        body('social_links').notEmpty().withMessage('Social links are required'),
      ];
    }
  }
};

exports.sendApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingApplication = await Application.findOne({ user_id: req.user.id, status: 'pending' });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already sent an application. We will review your application and get back to you soon.' });
    }

    const newApplication = new Application({
      user_id: req.user.id,
      specialty: req.body.specialty,
      experience: req.body.experience,
      example: req.body.example,
      description: req.body.description,
      social_links: req.body.social_links,
      status: 'pending',
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    next(err);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ user_id: req.user.id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ created_at: -1 }).populate('user_id');
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

exports.getById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('user_id');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
}

exports.rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (err) {
    next(err);
  }
}

exports.approveApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'approved';
    const updatedApplication = await application.save();

    // update user role
    const user = await User.findById(application.user_id);
    user.role = 'CONTRIBUTOR';
    await user.save();

    res.json(updatedApplication);
  } catch (err) {
    next(err);
  }
}