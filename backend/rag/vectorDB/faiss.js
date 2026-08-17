

const { IndexFlatL2 } = require("faiss-node");

const dimension = 3072;

const index = new IndexFlatL2(dimension);

const documents = [];

function addDocument(embedding, text) {

    console.log("========== ADDING DOCUMENT ==========");
    console.log("Embedding Length:", embedding.length);
    console.log("Text Length:", text.length);

    if (embedding.length !== dimension) {
        throw new Error(
            `Expected embedding dimension ${dimension}, got ${embedding.length}`
        );
    }

    index.add(embedding);

    documents.push({
        text,
        embedding,
    });

    console.log("FAISS total vectors:", index.ntotal());
    console.log("Documents stored:", documents.length);
}

function search(queryEmbedding, k = 5) {

    console.log("========== FAISS SEARCH ==========");
    console.log("Query embedding length:", queryEmbedding.length);
    console.log("FAISS total vectors:", index.ntotal());
    console.log("Documents stored:", documents.length);

    if (queryEmbedding.length !== dimension) {
        throw new Error(
            `Expected query embedding dimension ${dimension}, got ${queryEmbedding.length}`
        );
    }

    const total = index.ntotal();

    if (total === 0) {
        console.log("❌ FAISS INDEX IS EMPTY");
        return [];
    }

    k = Math.min(k, total);

    const result = index.search(queryEmbedding, k);

    console.log("FAISS labels:", result.labels);

    return result.labels
        .filter(id => id !== -1)
        .map(id => documents[id]);
}

module.exports = {
    addDocument,
    search,
};
