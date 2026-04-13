// server.js — entry point
require('dotenv').config(); // must be first line

const app       = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // connect to MongoDB first

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📋 POST /api/auth/register`);
    console.log(`📋 POST /api/auth/login`);
    console.log(`📋 GET  /api/applications`);
    console.log(`📋 POST /api/ai/parse`);
  });
};

startServer();