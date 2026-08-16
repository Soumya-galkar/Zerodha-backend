function buildContext(chunks) {
    return chunks
        .map((chunk) => chunk.text)
        .join("\n\n");
}

module.exports = {
    buildContext,
};
