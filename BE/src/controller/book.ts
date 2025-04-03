import { Request, RequestHandler, Response } from "express";

import { Book, Club } from "../db/schema";
import cloudinary from "../config/cloudinary";

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

export const addBookController = async (req: Request, res: Response): Promise<void> => {
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

        const cloudinaryFile = req.file as any;

        // Generate preview URL for the first page
        const previewUrl = cloudinary.url(cloudinaryFile.public_id, {
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
        const newBook = new Book({
            bookname: req.file.originalname,
            uid: req.uid,
            link: cloudinaryFile.path, // Original PDF URL
            previewLink: previewUrl,   // Preview image URL
            cloudinaryId: cloudinaryFile.public_id,
        });

        const savedBook = await newBook.save();

        if (!savedBook) {
            res.status(500).json({
                msg: "Failed to save book",
            });
            return;
        }

        const club = await Club.findByIdAndUpdate(
            clubId,
            { $set: { book: savedBook._id } },
            { new: true }
        );

        if (!club) {
            await Book.findByIdAndDelete(savedBook._id);
            res.status(404).json({
                msg: "Club not found",
            });
            return;
        }

        res.status(201).json({
            msg: "Book uploaded successfully",
            book: {
                ...savedBook.toJSON(),
                previewLink: previewUrl // Include preview URL in response
            },
            club,
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            msg: "Something went wrong",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Update Book model interface
interface Book {
    bookname: string;
    uid: string;
    link: string;
    previewLink: string; // Add previewLink field
    cloudinaryId: string;
}