require('dotenv').config({ path: './server/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API KEY found in ./server/.env");
    return;
  }
  
  console.log("Using Key:", apiKey.substring(0, 5) + "...");
  
  /* 
     Direct HTTP check to list models
  */
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log("Fetching available models list...");
  try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.models) {
          console.log("\nAVAILABLE MODELS:");
          data.models.forEach(m => console.log(`- ${m.name} (${m.version})`));
      } else {
          console.log("No 'models' property in response:", data);
      }
      
  } catch (err) {
      console.error("Fetch Error:", err);
  }
}

test();
