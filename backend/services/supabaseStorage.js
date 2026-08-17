const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = "pdfs";

async function uploadPDF(filePath, fileName) {
    const fs = require("fs");

    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
            contentType: "application/pdf",
            upsert: true,
        });

    if (error) {
        throw error;
    }

    console.log("✅ PDF uploaded to Supabase");
    console.log("Supabase path:", data.path);

    return data.path;
}

module.exports = {
    uploadPDF,
};
