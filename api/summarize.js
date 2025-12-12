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
        const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
        
        let summaryText = "";
        let lastError = null;
        
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `Summarize the following text in 4-6 lines, capturing the main points clearly:\n\n${content}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                summaryText = response.text().trim();
                break; // Success
            } catch (e) {
                console.warn(`Model ${modelName} failed, trying next...`);
                lastError = e;
            }
        }
        
        if (!summaryText) {
             const errString = lastError ? lastError.toString() : "";
             if (errString.includes("429") || errString.includes("Quota")) {
                 return res.status(200).json({ summary: "⏳ AI Usage Limit Reached. Please wait a few seconds." });
             }
             throw lastError || new Error("Models failed");
        }

        return res.status(200).json({ summary: summaryText });

    } catch (apiError) {
        console.error("All Gemini Models Failed:", apiError);
        return res.status(200).json({ summary: "⚠️ AI Error: " + apiError.message });
    }

  } catch (error) {
    console.error("Critical Handler Error:", error);
    return res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};
