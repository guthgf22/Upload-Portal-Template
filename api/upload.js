// api/upload.js
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST with form-data 'file' field" });
  }

  const form = new formidable.IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB (isteğe bağlı)
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    // Vercel yeni formidable sürümlerinde files.file bir dizi olur:
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded. Field name must be 'file'." });

    // Burada dosya /tmp içinde hazır. İstiyorsan 3rd-party storage'a forward edebilirsin.
    return res.status(200).json({
      message: "✅ File received",
      name: file.originalFilename || file.newFilename,
      size: file.size,
      tempPath: file.filepath,
    });
  });
}
