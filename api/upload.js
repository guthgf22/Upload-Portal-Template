// api/upload.js
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ uploadDir: "/tmp", keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    return res.status(200).json({
      message: "✅ File received successfully",
      name: file.originalFilename,
      size: file.size,
      tempPath: file.filepath,
    });
  });
}
