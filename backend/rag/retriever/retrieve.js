
const { getEmbedding } = require("../embeddings/embedder");
const { searchChunks } = require("../../services/supabaseVector");

async function retrieveRelevantChunks(question, k = 5) {

    console.log("Creating question embedding...");

    const queryEmbedding = await getEmbedding(question);

    console.log(
        "Query embedding length:",
        queryEmbedding.length
    );

    console.log("Searching Supabase pgvector...");

    const results = await searchChunks(
        queryEmbedding,
        k
    );

    console.log(
        "Retrieved chunks:",
        results.length
    );

    return results;
}

module.exports = {
    retrieveRelevantChunks,
};
