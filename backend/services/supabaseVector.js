const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function saveChunk(fileName, chunkText, embedding) {
    const { data, error } = await supabase
        .from("document_chunks")
        .insert({
            file_name: fileName,
            chunk_text: chunkText,
            embedding: embedding,
        })
        .select();

    if (error) {
        throw error;
    }

    return data;
}

async function searchChunks(queryEmbedding, matchCount = 5) {
    const { data, error } = await supabase.rpc(
        "match_document_chunks",
        {
            query_embedding: queryEmbedding,
            match_count: matchCount,
        }
    );

    if (error) {
        throw error;
    }

    return data;
}

module.exports = {
    saveChunk,
    searchChunks,
};
