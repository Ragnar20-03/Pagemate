import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 3000
export const DB_URL = process.env.DB_URL || " "
export const JWT_SECRETE = process.env.JWT_SECRETE || "roshan"


export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const USER_EMAIL = process.env.USER_EMAIL  // Your email address from .env
export const USER_PASS = process.env.USER_PASS // Your email password or app password from .env