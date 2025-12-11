const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Disable caching for all routes
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Mount routes (support both /api/notes and /notes for serverless compatibility)
app.use('/api/notes', noteRoutes);
app.use('/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send("API is running...");
});

module.exports = app;
