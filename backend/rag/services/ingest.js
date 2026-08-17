
const extractTextFromPDF = require("../parser/pdfParser");
const { splitText } = require("../chunking/chunker");
const { getEmbedding } = require("../embeddings/embedder");
const { saveChunk } = require("../../services/supabaseVector");

async function ingestDocument(filePath) {

    console.log("Extracting PDF...");

    const text = await extractTextFromPDF(filePath);

    console.log("Chunking...");

    const chunks = await splitText(text);

    console.log(`Chunks: ${chunks.length}`);

    console.log("Generating embeddings...");

    // Get filename from path
    const path = require("path");
    const fileName = path.basename(filePath);

    for (const chunk of chunks) {

        console.log("Generating embedding for chunk...");

        const embedding = await getEmbedding(
            chunk.pageContent
        );

        console.log(
            "Embedding length:",
            embedding.length
        );

        await saveChunk(
            fileName,
            chunk.pageContent,
            embedding
        );
    }

    console.log("Document saved to Supabase successfully");

    return chunks.length;
}

module.exports = {
    ingestDocument,
};
