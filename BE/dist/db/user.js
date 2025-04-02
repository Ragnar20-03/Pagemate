"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Club = exports.Book = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("../config/dotenv");
mongoose_1.default.connect(dotenv_1.DB_URL).then((res) => {
    console.log("conncetion to mongoose is succesfull !");
}).catch((err) => {
    console.log("Connection to mongoose is failed !");
});
const userSchema = new mongoose_1.default.Schema({
    fname: String,
    lname: String,
    email: String,
    // phone: { type: String, default: null },// not known till 
    password: String,
    joinedClubs: [{ type: mongoose_1.default.Types.ObjectId, ref: "Club" }]
});
const bookSchema = new mongoose_1.default.Schema({
    bookName: String,
    uid: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    link: String,
    coverImage: String
});
const clubSchema = new mongoose_1.default.Schema({
    admin: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    clubName: String,
    validTill: Date,
    isOpen: Boolean,
    book: { type: mongoose_1.default.Types.ObjectId, ref: "Book" },
    members: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" },]
});
exports.User = mongoose_1.default.model("User", userSchema);
exports.Book = mongoose_1.default.model("Book", bookSchema);
exports.Club = mongoose_1.default.model("Club", clubSchema);
