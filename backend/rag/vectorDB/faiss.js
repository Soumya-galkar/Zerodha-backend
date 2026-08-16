const { IndexFlatL2 } = require("faiss-node");

const dimension = 3072;

const index = new IndexFlatL2(dimension);

const documents = [];

function addDocument(embedding, text) {
    console.log("Embedding Length:", embedding.length);

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
}

function search(queryEmbedding, k = 5) {
    const total = index.ntotal();

    if (total === 0) {
        return [];
    }

    k = Math.min(k, total);

    const result = index.search(queryEmbedding, k);

    return result.labels
        .filter(id => id !== -1)
        .map(id => documents[id]);
}

module.exports = {
    addDocument,
    search,
};
