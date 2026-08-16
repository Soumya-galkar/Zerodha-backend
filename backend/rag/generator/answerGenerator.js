require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

async function generateAnswer(question, context) {

    const prompt = `
You are a helpful financial assistant.

Answer ONLY using the context below.

If the answer is not present, reply:
"I couldn't find that information in the uploaded document."

Context:
${context}

Question:
${question}

Answer:
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

module.exports = {
    generateAnswer,
};
