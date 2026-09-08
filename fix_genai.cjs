const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The new @google/genai SDK requires the API key to be passed explicitly if it doesn't automatically pick it up.
// Let's make absolutely sure we are passing it as a string to avoid any undefined issues.
code = code.replace(
`    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,`,
`    const apiKeyToUse = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey: apiKeyToUse,`
);

fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
