const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function check() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) console.log("NO API KEY");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.5-pro-latest"
    ];

    for (const m of modelsToTry) {
        console.log(`\n--- Testing ${m} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hi");
            console.log("SUCCESS");
            console.log(result.response.text());
        } catch (e) {
            console.log("ERROR CODE:", e.status);
            console.log("ERROR MESSAGE:", e.message);
        }
    }
}

check();
