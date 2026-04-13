// src/controllers/aiController.js
// Thin controller — just calls the service and sends the response.
// All OpenAI logic stays in aiService.js

const { parseJobDescription } = require('../services/aiService');

// POST /api/ai/parse
const parseJD = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job description of at least 50 characters'
      });
    }

    const result = await parseJobDescription(jobDescription.trim());

    return res.status(200).json({
      success: true,
      message: 'Job description parsed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in parseJD:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI parsing failed. Please try again or fill in the details manually.'
    });
  }
};

module.exports = { parseJD };