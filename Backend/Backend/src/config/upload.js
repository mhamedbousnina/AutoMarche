import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Seules les images sont acceptées"));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { files: 10, fileSize: 5 * 1024 * 1024 }, // 5MB/photo
});