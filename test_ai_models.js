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
          console.log("\n--- STABLE MODELS CHECK ---");
          const allNames = data.models.map(m => m.name);
          
          const targets = [
              "models/gemini-1.5-flash", 
              "models/gemini-1.5-flash-001",
              "models/gemini-1.5-pro",
              "models/gemini-1.5-pro-001",
              "models/gemini-pro",
              "models/gemini-1.0-pro"
          ];
          
          targets.forEach(t => {
              const found = allNames.find(n => n === t || n.endsWith("/" + t) || n === t.replace("models/", ""));
              if (found) console.log(`[AVAILABLE] ${t} -> ${found}`);
              else console.log(`[MISSING]   ${t}`);
          });
          
          console.log("\n--- OTHER NOTABLE MODELS ---");
           data.models.forEach(m => {
               if (m.name.includes("latest") || m.name.includes("flash")) {
                   console.log(m.name);
               }
           });

      } else {
          console.log("No 'models' property in response:", data);
      }
      
  } catch (err) {
      console.error("Fetch Error:", err);
  }
}

test();
