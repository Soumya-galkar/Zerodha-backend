const { getCollection } = require("./faiss");

async function storeChunks(chunks, embeddings) {

    const collection = await getCollection();

    await collection.add({

        ids: chunks.map((_, i) => `chunk-${i}`),

        documents: chunks.map(chunk => chunk.pageContent),

        embeddings: embeddings,

        metadatas: chunks.map((_, i) => ({
            chunkId: i
        }))
    });

    console.log("Stored in ChromaDB");
}

module.exports = {
    storeChunks
};
