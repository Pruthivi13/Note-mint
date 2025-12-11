require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./src/models/Note');

console.log("Connect DB...");
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected.");
    console.log("Schema Paths:", Object.keys(Note.schema.paths));
    
    // Check strict mode
    console.log("Strict Mode:", Note.schema.options.strict);
    
    process.exit(0);
});
