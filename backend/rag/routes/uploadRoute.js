const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});

const ingestModule = require("../services/ingest");

console.log("INGEST MODULE:", ingestModule);

const { ingestDocument } = ingestModule;
router.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

       const filePath = req.file.path;

// Ingest the document into FAISS
const totalChunks = await ingestDocument(filePath);

res.status(200).json({
    success: true,
    message: "PDF uploaded and indexed successfully",
    chunks: totalChunks
});
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
});

module.exports = router;
