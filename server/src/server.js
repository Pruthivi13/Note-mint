const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();
console.log("Debug: GEMINI_API_KEY loaded?", !!process.env.GEMINI_API_KEY);

const PORT = 5005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
