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
exports.Club = exports.Book = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("../config/dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next(); // Skip if not modified
        const salt = yield bcrypt_1.default.genSalt(10); // Generate salt
        //@ts-ignore
        this.password = yield bcrypt_1.default.hash(this.password, salt); // Hash password
        next();
    });
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
    clubCode: String,
    validTill: Date,
    isOpen: Boolean,
    book: { type: mongoose_1.default.Types.ObjectId, ref: "Book" },
    members: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" },]
});
clubSchema.pre("save", function (next) {
    if (this.validTill && new Date() > this.validTill) {
        this.isOpen = false;
    }
    next();
});
exports.User = mongoose_1.default.model("User", userSchema);
exports.Book = mongoose_1.default.model("Book", bookSchema);
exports.Club = mongoose_1.default.model("Club", clubSchema);
