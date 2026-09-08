const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace wrong model name
code = code.replace(/gemini-3.6-flash/g, 'gemini-1.5-flash');

// Make ai client lazily initialized to catch missing API key with a clear error
code = code.replace(
`const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});`,
`let aiClient = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it.");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}`
);

// Replace ai.models with getAI().models
code = code.replace(/ai\.models/g, 'getAI().models');

fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
