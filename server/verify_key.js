const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env file.");
    process.exit(1);
}

console.log(`Checking API Key: ${apiKey.substring(0, 5)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            
            if (res.statusCode !== 200) {
                console.error(`\n❌ API Verification Failed (Status: ${res.statusCode})`);
                console.error("Error Message:", JSON.stringify(parsed, null, 2));
                console.log("\nPossible Causes:");
                console.log("1. API Key is invalid or expired.");
                console.log("2. Google Generative AI API is not enabled in your Google Cloud Console.");
                console.log("3. Billing is not enabled (if required).");
            } else {
                console.log("\n✅ API Key is Valid!");
                console.log(`Found ${parsed.models?.length || 0} available models.\n`);
                console.log("--- Available Models for this Key ---");
                const modelNames = parsed.models.map(m => m.name.replace('models/', ''));
                modelNames.forEach(name => console.log(`- ${name}`));
                
                console.log("\n--- Recommended Action ---");
                console.log("Update your code to use one of the exact names listed above.");
            }
        } catch (e) {
            console.error("Failed to parse response:", e.message);
            console.log("Raw response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err.message);
});
