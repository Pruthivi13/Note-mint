require('dotenv').config();
const mongoose = require('mongoose');

console.log("Connect DB...");
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected.");
    
    // Bypass Mongoose model and use native driver for absolute truth
    const collection = mongoose.connection.db.collection('notes');
    const note = await collection.findOne({ title: 'Test Note 1' });
    
    console.log("RAW MONGODB DOCUMENT:");
    console.log(JSON.stringify(note, null, 2));
    
    process.exit(0);
});
