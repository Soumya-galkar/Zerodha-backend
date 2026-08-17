// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, "../uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === "application/pdf") {
//             cb(null, true);
//         } else {
//             cb(new Error("Only PDF files are allowed"));
//         }
//     }
// });

// const ingestModule = require("../services/ingest");

// console.log("INGEST MODULE:", ingestModule);

// const { ingestDocument } = ingestModule;
// router.post("/upload", upload.single("pdf"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//        const filePath = req.file.path;

// // Ingest the document into FAISS
// const totalChunks = await ingestDocument(filePath);

// res.status(200).json({
//     success: true,
//     message: "PDF uploaded and indexed successfully",
//     chunks: totalChunks
// });
//     } catch (error) {
//         console.error("Error processing PDF:", error);
//         res.status(500).json({ error: "Failed to process PDF" });
//     }
// });

// module.exports = router;





const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { uploadPDF } = require("../../services/supabaseStorage");
const { ingestDocument } = require("../services/ingest");

const router = express.Router();

// Temporary upload directory
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
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


router.post("/upload", upload.single("pdf"), async (req, res) => {

    let filePath = null;

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No PDF uploaded"
            });
        }

        filePath = req.file.path;

        console.log("📄 PDF received:", req.file.originalname);
        console.log("📁 Temporary path:", filePath);


        // ==============================
        // 1. Upload PDF to Supabase
        // ==============================

        const supabasePath = await uploadPDF(
            filePath,
            `${Date.now()}-${req.file.originalname}`
        );

        console.log("☁️ Supabase path:", supabasePath);


        // ==============================
        // 2. Process PDF for RAG
        // ==============================

        const totalChunks = await ingestDocument(filePath);

        console.log("🧩 Total chunks:", totalChunks);


        // ==============================
        // 3. Delete temporary file
        // ==============================

        fs.unlinkSync(filePath);

        console.log("🗑️ Temporary file deleted");


        // ==============================
        // 4. Response
        // ==============================

        res.status(200).json({
            success: true,
            message: "PDF uploaded and indexed successfully",
            supabasePath,
            chunks: totalChunks
        });

    } catch (error) {

        console.error("❌ Error processing PDF:", error);

        // Clean temporary file if something failed
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
