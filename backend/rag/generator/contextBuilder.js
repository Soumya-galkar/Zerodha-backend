function buildContext(chunks) {
    return chunks
        .map((chunk) => chunk.chunk_text)
        .filter(Boolean)
        .join("\n\n");
}

module.exports = {
    buildContext,
};
