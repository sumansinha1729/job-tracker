// src/routes/aiRoutes.js
const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { parseJD }    = require('../controllers/aiController');

router.post('/parse', authMiddleware, parseJD);

module.exports = router;