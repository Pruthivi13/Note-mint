const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateSummary = async (content) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found.");
      return "✨ [Demo Mode] AI Summarization is active! To get real AI summaries, please add your GEMINI_API_KEY to the server/.env file.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use Experimental model for better free tier quota
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
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
