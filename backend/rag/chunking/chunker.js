function splitText(text, chunkSize = 500, overlap = 50) {
    const chunks = [];

    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);

        chunks.push({
            pageContent: text.slice(start, end),
        });

        start += (chunkSize - overlap);
    }

    return chunks;
}

module.exports = {
    splitText,
};
