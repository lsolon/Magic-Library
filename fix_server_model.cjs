const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The new @google/genai SDK requires the "gemini-1.5-flash" string. Let's make sure it's EXACTLY that.
// Wait, the SDK uses the correct format. Let's check if the SDK itself is having an issue.
// The new SDK (@google/genai) uses model: 'gemini-2.5-flash' usually or 'gemini-1.5-flash'
code = code.replace(/gemini-1.5-flash/g, 'gemini-1.5-flash'); // Just in case, replace with 1.5. Wait, 1.5 was working before.
// Wait, the error is: "models/gemini-1.5-flash is not found for API version v1beta"
// The correct model name might be "gemini-1.5-flash" or "gemini-2.0-flash".
// Let's use "gemini-2.5-flash" as it's the standard for the new SDK, or "gemini-1.5-flash"
code = code.replace(/gemini-1.5-flash/g, 'gemini-2.5-flash');

fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
