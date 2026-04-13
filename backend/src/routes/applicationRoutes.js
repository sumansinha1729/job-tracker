// src/routes/applicationRoutes.js
const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

// Apply authMiddleware to ALL routes in this file
router.use(authMiddleware);

router.post('/',      createApplication);
router.get('/',       getApplications);
router.get('/:id',    getApplicationById);
router.put('/:id',    updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;