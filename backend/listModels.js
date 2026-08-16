require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function main() {
  const pager = await ai.models.list();

  for await (const model of pager) {
    console.log(model.name);
    console.log(model.supportedActions);
    console.log("---------------------");
  }
}

main();
