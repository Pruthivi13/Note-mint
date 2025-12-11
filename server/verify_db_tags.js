require('dotenv').config();
const mongoose = require('mongoose');

console.log("Connect DB...");
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected.");
    
    const collection = mongoose.connection.db.collection('notes');
    const notes = await collection.find({}).toArray();
    console.log(`Found ${notes.length} notes.`);
    notes.forEach(note => {
        console.log(`ID: ${note._id}, Title: ${note.title}, Tags: ${JSON.stringify(note.tags)}`);
    });
    
    process.exit(0);
});
