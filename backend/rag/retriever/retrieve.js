const { getEmbedding } = require("../embeddings/embedder");
const { search } = require("../vectorDB/faiss");

async function retrieveRelevantChunks(question, k = 5) {

    console.log("Creating question embedding...");

    const queryEmbedding = await getEmbedding(question);

    console.log("Searching FAISS...");

    const results = search(queryEmbedding, k);

    return results;
}

module.exports = {
    retrieveRelevantChunks,
};
