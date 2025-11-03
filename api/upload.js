// api/upload.js
import formidable from "formidable";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST with form-data 'file' field" });
  }

  const form = new formidable.IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 * 1024 // 2GB
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const f = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!f) return res.status(400).json({ error: "No file uploaded (field: file)" });

    return res.status(200).json({
      message: "✅ File received",
      name: f.originalFilename || f.newFilename,
      size: f.size,
      tempPath: f.filepath
    });
  });
}
