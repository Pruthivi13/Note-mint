const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send("API is running...");
});

module.exports = app;
