const extractTextFromPDF = require("../parser/pdfParser");
const { splitText } = require("../chunking/chunker");
const { getEmbedding } = require("../embeddings/embedder");
const { addDocument } = require("../vectordb/faiss");

async function ingestDocument(filePath) {
    console.log("Extracting PDF...");
    const text = await extractTextFromPDF(filePath);

    console.log("Chunking...");
    const chunks = await splitText(text);

    console.log(`Chunks: ${chunks.length}`);

    console.log("Generating embeddings...");

    for (const chunk of chunks) {
        const embedding = await getEmbedding(chunk.pageContent);

        addDocument(
            embedding,
            chunk.pageContent
        );
    }

    console.log("Document Indexed Successfully");

    return chunks.length;
}

module.exports = {
    ingestDocument,
};
