import mongoose, { mongo } from "mongoose";
import { DB_URL } from "../config/dotenv";
import bcrypt from "bcrypt"
mongoose.connect(DB_URL).then((res) => {
    console.log("conncetion to mongoose is succesfull !");
}).catch((err) => {
    console.log("Connection to mongoose is failed !");
})

const requestSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Types.ObjectId, ref: "User" },
    isAccepted: { type: String, enum: ["pending", "accepted", "declined"] },
    date: Date
})

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    // phone: { type: String, default: null },// not known till 
    password: String,
    joinedClubs: [{ type: mongoose.Types.ObjectId, ref: "Club" }],
    freinds: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    requests: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if not modified

    const salt = await bcrypt.genSalt(10); // Generate salt
    //@ts-ignore
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
});

const bookSchema = new mongoose.Schema({
    bookName: String,
    uid: { type: mongoose.Types.ObjectId, ref: "User" },
    link: String,
    coverImage: String
})

const clubSchema = new mongoose.Schema({
    admin: { type: mongoose.Types.ObjectId, ref: "User" },
    clubName: String,
    clubCode: String,
    validTill: Date,
    isOpen: Boolean,
    book: { type: mongoose.Types.ObjectId, ref: "Book" },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" },]
})
clubSchema.pre("save", function (next) {
    if (this.validTill && new Date() > this.validTill) {
        this.isOpen = false;
    }
    next();
});
export const User = mongoose.model("User", userSchema)
export const Book = mongoose.model("Book", bookSchema)
export const Club = mongoose.model("Club", clubSchema)
export const AddFreind = mongoose.model("AddFreind", requestSchema)
