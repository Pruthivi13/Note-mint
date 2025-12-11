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
          summary: "✨ [Demo Mode] Add GEMINI_API_KEY to Vercel Env Vars to enable AI." 
      });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ summary: text.trim() });
    } catch (apiError) {
        console.error("Gemini API Error:", apiError);
        return res.status(200).json({ summary: "⚠️ API Error: " + apiError.message });
    }

  } catch (error) {
    console.error("Critical Handler Error:", error);
    return res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};
