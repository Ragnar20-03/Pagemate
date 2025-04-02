import { Request, RequestHandler, Response } from "express";

import { Book, Club } from "../db/schema";

export const addBookController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        let clubId = req.params.clubId
        if (!clubId) {
            return res.status(501).json({
                status: "Failed",
                msg: "Club id is necessary"
            })
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        // Get file details from Cloudinary
        const { originalname } = req.file;
        const cloudinaryFile = req.file as any; // Type assertion for Cloudinary response

        // Save book details in the database
        const newBook = new Book({
            bookname: originalname,
            uid: req.uid, // User ID from middleware
            link: cloudinaryFile.path, // Cloudinary file URL
        });

        let query = await newBook.save();
        if (query) {
            let club = await Club.findByIdAndUpdate(clubId, { book: newBook._id })
            if (club) {
                return res.status(201).json({
                    msg: "Book uploaded successfully",
                    book: newBook,
                    club
                });
            }
            else {
                return res.status(404).json({
                    msg: "No Club Found",
                });
            }
        }
        else {
            return res.status(404).json({
                msg: "failed query !!!",
            });
        }


    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ msg: "Something went wrong ", });
    }
};
