const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateSummary = async (content) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found.");
      return "✨ [Demo Mode] AI Summarization is active! To get real AI summaries, please add your GEMINI_API_KEY to the server/.env file.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Switching to 2.5-flash to bypass 2.0 rate limits
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("AI Service Error:", error);
    
    // Distinguish between Rate Limit (429) and Auth/Model issues (404/401)
    if (error.status === 429 || error.toString().includes('429')) {
         console.warn("Rate limit hit.");
         return `[Falback Summary]: (Rate Limit Hit) Please wait a minute and try again. The free tier has limits.`;
    }
    
    if (error.toString().includes('404') || error.status === 401) {
        console.warn("Falling back to mock summary due to API error:", error.message);
        return `[Fallback Summary]: (API Error) ${content.substring(0, 100)}... \n\nCheck your API Key permissions at: https://aistudio.google.com/`;
    }

    throw error;
  }
};

module.exports = { generateSummary };
