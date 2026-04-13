// src/controllers/applicationController.js
const Application = require('../models/Application');

// ── Create ────────────────────────────────────────
// POST /api/applications
const createApplication = async (req, res) => {
  try {
    const {
      company, role, status, jdLink, notes,
      dateApplied, salaryRange, requiredSkills,
      niceToHaveSkills, seniority, location, resumeSuggestions
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company and role are required'
      });
    }

    const application = new Application({
      userId: req.user.id, // from authMiddleware
      company, role, status, jdLink, notes,
      dateApplied, salaryRange, requiredSkills,
      niceToHaveSkills, seniority, location, resumeSuggestions
    });

    const saved = await application.save();

    return res.status(201).json({
      success: true,
      message: 'Application created',
      data: saved
    });
  } catch (error) {
    console.error('Error in createApplication:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Get all (for logged-in user only) ─────────────
// GET /api/applications
const getApplications = async (req, res) => {
  try {
    // userId filter ensures users only see THEIR OWN applications
    const applications = await Application
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Get single ────────────────────────────────────
// GET /api/applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id:    req.params.id,
      userId: req.user.id // security: can only access own applications
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid application id' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Update ────────────────────────────────────────
// PUT /api/applications/:id
const updateApplication = async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated',
      data: updated
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Delete ────────────────────────────────────────
// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Application deleted',
      data: deleted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};