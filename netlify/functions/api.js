const serverless = require("serverless-http");
const app = require("../../server/src/app");
const mongoose = require("mongoose");
require("dotenv").config();

// Ensure connection is reused in Serverless environment
let conn = null;

const connectDB = async () => {
  if (conn == null) {
    console.log("Creating new MongoDB connection...");
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    return conn;
  }
  console.log("Reusing existing MongoDB connection.");
  return conn;
};

module.exports.handler = async (event, context) => {
  // Make sure to add this so the function doesn't timeout waiting for DB connection to close
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
  } catch (error) {
    console.error("Database Connection Error:", error);
    // Continue processing, let the app handle the DB failure if it tries to access it
  }

  // Delegate to the express app wrapped by serverless-http
  return serverless(app)(event, context);
};
