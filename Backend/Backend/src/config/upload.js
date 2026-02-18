// src/config/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const isAvatar = file.fieldname === "avatar";
    const userId = req.user?._id?.toString() || "anon";

    // avatar-userId-date.ext  OU  photo-userId-date-rand.ext
    const base = isAvatar ? `avatar-${userId}-${Date.now()}` : `photo-${userId}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}${ext}`);
  },
});

function imageOnlyFilter(req, file, cb) {
  if (!file.mimetype?.startsWith("image/")) {
    return cb(new Error("Le fichier doit être une image"), false);
  }
  cb(null, true);
}

// ✅ Upload générique pour annonces (photos)
export const upload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB par image
});

// ✅ Upload avatar (1 image)
export const uploadAvatar = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});