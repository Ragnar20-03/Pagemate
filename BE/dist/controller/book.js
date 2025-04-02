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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookController = void 0;
const schema_1 = require("../db/schema");
const addBookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let clubId = req.params.clubId;
        if (!clubId) {
            return res.status(501).json({
                status: "Failed",
                msg: "Club id is necessary"
            });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        // Get file details from Cloudinary
        const { originalname } = req.file;
        const cloudinaryFile = req.file; // Type assertion for Cloudinary response
        // Save book details in the database
        const newBook = new schema_1.Book({
            bookname: originalname,
            uid: req.uid, // User ID from middleware
            link: cloudinaryFile.path, // Cloudinary file URL
        });
        let query = yield newBook.save();
        if (query) {
            let club = yield schema_1.Club.findByIdAndUpdate(clubId, { book: newBook._id });
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
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ msg: "Something went wrong ", });
    }
});
exports.addBookController = addBookController;
