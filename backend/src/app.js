// src/app.js
const express = require('express');
const cors    = require('cors');
const app     = express();

// Allow requests from the frontend (Vite runs on 5173 by default)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin:      ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount all routes under /api
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/ai',           require('./routes/aiRoutes'));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Job Tracker API is running' });
});

// 404 — route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

module.exports = app;