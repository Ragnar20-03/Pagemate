import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure storage to upload PDFs to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        //@ts-ignore
        folder: "books", // Cloudinary folder name
        resource_type: "raw", // For PDFs, use "raw" instead of "image"
        //@ts-ignore
        format: async (req, file) => "pdf", // Force PDF format
    },
});

// Initialize Multer with Cloudinary storage
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});


export default upload;
