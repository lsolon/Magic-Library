const { GoogleGenAI } = require("@google/genai");

async function test() {
  try {
    console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello"
    });
    console.log("Success:", !!response.text);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
