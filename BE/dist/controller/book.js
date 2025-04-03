"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookController = void 0;
const schema_1 = require("../db/schema");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// export const addBookController = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const clubId = req.params.clubId;
//         if (!clubId) {
//             res.status(400).json({
//                 status: "Failed",
//                 msg: "Club ID is required",
//             });
//             return;
//         }
//         if (!req.file) {
//             res.status(400).json({
//                 msg: "No file uploaded",
//             });
//             return;
//         }
//         // Type assertion for Cloudinary response
//         const cloudinaryFile = req.file as any;
//         // Create new book document
//         const newBook = new Book({
//             bookname: req.file.originalname,
//             uid: req.uid, // From userMiddleware
//             link: cloudinaryFile.path, // Cloudinary secure URL
//             cloudinaryId: cloudinaryFile.public_id, // Store public_id for future reference
//         });
//         const savedBook = await newBook.save();
//         if (!savedBook) {
//             res.status(500).json({
//                 msg: "Failed to save book",
//             });
//             return;
//         }
//         // Update club with book reference
//         const club = await Club.findByIdAndUpdate(
//             clubId,
//             { $set: { book: savedBook._id } },
//             { new: true }
//         );
//         if (!club) {
//             // Consider deleting the uploaded book if club update fails
//             await Book.findByIdAndDelete(savedBook._id);
//             res.status(404).json({
//                 msg: "Club not found",
//             });
//             return;
//         }
//         res.status(201).json({
//             msg: "Book uploaded successfully",
//             book: savedBook,
//             club,
//         });
//     } catch (error) {
//         console.error("Upload error:", error);
//         res.status(500).json({
//             msg: "Something went wrong",
//             error: error instanceof Error ? error.message : "Unknown error",
//         });
//     }
// };
const addBookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubId = req.params.clubId;
        if (!clubId) {
            res.status(400).json({
                status: "Failed",
                msg: "Club ID is required",
            });
            return;
        }
        if (!req.file) {
            res.status(400).json({
                msg: "No file uploaded",
            });
            return;
        }
        const cloudinaryFile = req.file;
        // Generate preview URL for the first page
        const previewUrl = cloudinary_1.default.url(cloudinaryFile.public_id, {
            resource_type: "raw",
            transformation: [
                {
                    width: 500,
                    crop: "scale",
                    format: "jpg",
                    page: 1,
                    quality: "auto"
                }
            ]
        });
        // Create new book document
        const newBook = new schema_1.Book({
            bookname: req.file.originalname,
            uid: req.uid,
            link: cloudinaryFile.path, // Original PDF URL
            previewLink: previewUrl, // Preview image URL
            cloudinaryId: cloudinaryFile.public_id,
        });
        const savedBook = yield newBook.save();
        if (!savedBook) {
            res.status(500).json({
                msg: "Failed to save book",
            });
            return;
        }
        const club = yield schema_1.Club.findByIdAndUpdate(clubId, { $set: { book: savedBook._id } }, { new: true });
        if (!club) {
            yield schema_1.Book.findByIdAndDelete(savedBook._id);
            res.status(404).json({
                msg: "Club not found",
            });
            return;
        }
        res.status(201).json({
            msg: "Book uploaded successfully",
            book: Object.assign(Object.assign({}, savedBook.toJSON()), { previewLink: previewUrl // Include preview URL in response
             }),
            club,
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            msg: "Something went wrong",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.addBookController = addBookController;
