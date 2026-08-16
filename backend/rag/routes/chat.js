
const express = require("express");

const { retrieveRelevantChunks } = require("../retriever/retrieve");
const { buildContext } = require("../generator/contextBuilder");
const { generateAnswer } = require("../generator/answerGenerator");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        console.log("\n==============================");
        console.log("QUESTION:", question);
        console.log("==============================");

        // 1. Retrieve relevant chunks
        const chunks = await retrieveRelevantChunks(question, 5);

        console.log("\n========== RETRIEVED CHUNKS ==========");
        console.log("Number of chunks:", chunks.length);
        console.log(chunks);

        // 2. Build context
        const context = buildContext(chunks);

        console.log("\n========== CONTEXT ==========");
        console.log(context);

        // 3. Generate answer
        const answer = await generateAnswer(question, context);

        console.log("\n========== ANSWER ==========");
        console.log(answer);

        res.json({
            success: true,
            answer,
            sources: chunks,
        });

    } catch (err) {
        console.error("\n========== CHAT ERROR ==========");
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = router;
