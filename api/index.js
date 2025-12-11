const app = require('../server/src/app');
const serverless = require('serverless-http');

// Vercel Serverless Function entry point
// Express app handles routes starting with /api
module.exports = serverless(app);
