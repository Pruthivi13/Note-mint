const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
// Connect to Database (Optional for Local Storage mode)
// connectDB(); 
console.log("Debug: Skipping MongoDB connection (Running in AI-Gateway mode)");
console.log("Debug: GEMINI_API_KEY loaded?", !!process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
