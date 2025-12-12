const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { content } = JSON.parse(event.body);

    if (!content) {
        return { statusCode: 400, body: JSON.stringify({ message: "Content is required" }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found.");
      return {
        statusCode: 200,
        body: JSON.stringify({ 
            summary: "✨ [Demo Mode] AI Summarization is active! Add GEMINI_API_KEY to Netlify Env Vars for real results." 
        })
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
    let text = "";
    let lastError = null;

    for (const modelName of models) {
        try {
            console.log(`[Netlify] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
            break;
        } catch (e) {
            console.warn(`[Netlify] ${modelName} failed: ${e.message}`);
            lastError = e;
        }
    }

    if (!text) {
         const errString = lastError ? lastError.toString() : "";
         if (errString.includes("429") || errString.includes("Quota")) {
             return {
                statusCode: 200,
                body: JSON.stringify({ summary: "⏳ AI Usage Limit Reached. Please wait a few seconds and try again." })
             };
         }
         throw lastError || new Error("All AI models failed.");
    }

    return {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allow all origins for dev simplicity
          "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ summary: text.trim() }),
    };

  } catch (error) {
    console.error("AI Service Error:", error);
    
    let fallbackMsg = "Failed to generate summary.";
    
    if (error.status === 429 || error.toString().includes('429')) {
         fallbackMsg = `[Fallback Summary]: (Rate Limit Hit) Please wait a minute and try again.`;
    } else if (error.toString().includes('404') || error.status === 401) {
         fallbackMsg = `[Fallback Summary]: (API Error) Check your API Key permissions.`;
    } else {
         fallbackMsg = error.message || "Unknown error";
    }

    return {
      statusCode: 500, // Or 200 if you want to show the fallback error as text
      body: JSON.stringify({ message: fallbackMsg }),
    };
  }
};
