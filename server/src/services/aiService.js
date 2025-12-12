const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateSummary = async (content) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found.");
      return "✨ [Demo Mode] AI Summarization is active! To get real AI summaries, please add your GEMINI_API_KEY to the server/.env file.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List of models to try in order of preference (Stable 2.0 first)
    const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
    
    let text = null;
    let lastError = null;

    for (const modelName of models) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
            
            if (text) break; // Success!
        } catch (e) {
            console.warn(`Model ${modelName} failed: ${e.message}`);
            lastError = e;
            // specific check: if it's a 404, valid to try next. If it's a 429, we might want to try next too (different bucket?) 
            // but generally 429 is global. We'll keep trying just in case.
        }
    }
    
    if (!text) {
        const errString = lastError ? lastError.toString() : "Unknown Error";
        if (errString.includes("429") || errString.includes("Quota") || errString.includes("resource_exhausted")) {
            return "⏳ AI Usage Limit Reached. Please wait a few seconds and try again.";
        }
        return "⚠️ Failed to generate summary. Please check server logs.";
    }
    
    return text.trim();
  } catch (error) {
    console.warn("AI Service Error (Rate Limit/Quota):", error.message);
    
    // Fallback: Simple heuristic summary (First 3 sentences)
    const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [content];
    const fallbackSummary = sentences.slice(0, 3).join(' ') + " (Generated offline due to high traffic)";
    
    return fallbackSummary;
  }
    

};

module.exports = { generateSummary };
