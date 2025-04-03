// upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "books",
        resource_type: "raw",
        public_id: `book_${Date.now()}`,
        allowed_formats: ["pdf"],
        // Add transformation for preview
        transformation: [
            {
                width: 500, // Reasonable width for mobile preview
                crop: "scale",
                format: "jpg", // Convert first page to JPG for preview
                page: 1, // First page only
                quality: "auto"
            }
        ]
    }),
});

export const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
});