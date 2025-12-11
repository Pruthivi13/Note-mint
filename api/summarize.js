const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // CORS Config
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ 
          summary: "✨ [Demo Mode] AI Summarization is active! Add GEMINI_API_KEY to Vercel Env Vars for real results." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;
    
    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ summary: text.trim() });

  } catch (error) {
    console.warn("AI Service Error (Rate Limit/Quota):", error.message);
    
    // Fallback: Simple extraction summary
    const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [content];
    const fallbackSummary = sentences.slice(0, 3).join(' ') + " (Running offline due to high traffic)";
    
    return res.status(200).json({ 
        summary: fallbackSummary,
        isFallback: true 
    });
  }
};
