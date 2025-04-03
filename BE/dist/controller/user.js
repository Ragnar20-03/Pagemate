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
exports.removeFreindController = exports.acceptFreindRequestController = exports.AddFreindController = exports.getAllUsers = exports.loginController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const dotenv_1 = require("../config/dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, password } = req.body;
        if (!fname || !lname || !email || !password) {
            return res.status(501).json({
                status: "failed",
                msg: "AllFeilds are necessary !",
            });
        }
        let newUser = new schema_1.User({ fname, lname, email, password });
        if (newUser) {
            yield newUser.save();
            return res.status(200).json({
                status: "success",
                msg: "Account Created Succesfully !"
            });
        }
        else {
            return res.status(200).json({
                status: "failed",
                msg: "Account Created Failed !"
            });
        }
    }
    catch (err) {
        // console.log("error is : ", err);
        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(501).json({
                status: "failed",
                msg: "AllFeilds are necessary !",
            });
        }
        let user = yield schema_1.User.findOne({ email });
        if (user) {
            //@ts-ignore
            if (yield bcrypt_1.default.compare(password, user.password)) {
                // JSOn Web Token Generation
                let token = jsonwebtoken_1.default.sign({ uid: user._id }, dotenv_1.JWT_SECRETE);
                // res.cookie('token', token)
                return res.status(200).json({
                    status: "success",
                    msg: "Login Succesfull !",
                    token
                });
            }
            else {
                return res.status(501).json({
                    status: "failed",
                    msg: "Password Mismatch !"
                });
            }
        }
        else {
            return res.status(404).json({
                status: "failed",
                msg: "Account Not Found !"
            });
        }
    }
    catch (err) {
        // console.log("error is : ", err);
        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        });
    }
});
exports.loginController = loginController;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield schema_1.User.find();
    return res.status(200).json({
        status: "success",
        users
    });
});
exports.getAllUsers = getAllUsers;
const AddFreindController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uid = req.uid;
        let { receiver } = req.body;
        if (!receiver) {
            return res.status(501).json({
                status: "failed", msg: "All Feilds are necessary"
            });
        }
        let request = yield schema_1.AddFreind.create({ date: Date.now(), sender: uid, receiver, isAccepted: "pending" });
        if (request) {
            let user = yield schema_1.User.findByIdAndUpdate(receiver, { $addToSet: { requests: request } });
            if (user) {
                return res.status(200).json({
                    status: "success",
                    msg: "Freind Request sent succesfully !"
                });
            }
            else {
                return res.status(501).json({
                    status: "failed",
                    msg: "unable to send freind request"
                });
            }
        }
        else {
            return res.status(501).json({
                status: "failed",
                msg: "unable to craete Request "
            });
        }
    }
    catch (err) {
        console.log("error is : ", err);
        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong ",
        });
    }
});
exports.AddFreindController = AddFreindController;
const acceptFreindRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uid = req.uid; // Current user accepting the request
        let reqId = req.params.reqId; // Friend request ID
        if (!mongoose_1.default.Types.ObjectId.isValid(reqId)) {
            return res.status(400).json({ status: "failed", msg: "Invalid request ID" });
        }
        // Find the friend request
        let request = yield schema_1.AddFreind.findById(reqId);
        if (!request) {
            return res.status(404).json({ status: "failed", msg: "Friend request not found" });
        }
        if (request.isAccepted !== "pending") {
            return res.status(400).json({ status: "failed", msg: "Request already processed" });
        }
        console.log("req.receiver : " + request.receiver + " uid : " + uid);
        // Ensure the receiver is the one accepting the request
        // @ts-ignore
        if (request.receiver.toString() !== uid) {
            return res.status(403).json({ status: "failed", msg: "Unauthorized action" });
        }
        let senderId = request.sender;
        let receiverId = request.receiver;
        // Update the request status to "accepted"
        request.isAccepted = "accepted";
        yield request.save();
        // Add each other as friends
        yield schema_1.User.findByIdAndUpdate(senderId, { $addToSet: { freinds: receiverId } });
        yield schema_1.User.findByIdAndUpdate(receiverId, { $addToSet: { freinds: senderId } });
        // Remove the request from both users' requests array
        yield schema_1.User.findByIdAndUpdate(senderId, { $pull: { requests: reqId } });
        yield schema_1.User.findByIdAndUpdate(receiverId, { $pull: { requests: reqId } });
        // Optionally, delete the request from the database
        yield schema_1.AddFreind.findByIdAndDelete(reqId);
        return res.status(200).json({
            status: "success",
            msg: "Friend request accepted",
        });
    }
    catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ status: "failed", msg: "Something went wrong" });
    }
});
exports.acceptFreindRequestController = acceptFreindRequestController;
const removeFreindController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uid = req.uid; // Current user removing the friend
        let friendId = req.params.friendId; // Friend's user ID
        console.log("freind Id is ; ", friendId);
        if (!mongoose_1.default.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ status: "failed", msg: "Invalid friend ID" });
        }
        let user = yield schema_1.User.findById(uid);
        let friend = yield schema_1.User.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ status: "failed", msg: "User or friend not found" });
        }
        // Ensure they are actually friends before removing
        if (!user.freinds.map(f => f.toString()).includes(friendId) ||
            //@ts-ignore
            !friend.freinds.map(f => f.toString()).includes(uid.toString())) {
            return res.status(400).json({ status: "failed", msg: "Not friends" });
        }
        // Remove each other from their friends list
        yield schema_1.User.findByIdAndUpdate(uid, { $pull: { freinds: friendId } });
        yield schema_1.User.findByIdAndUpdate(friendId, { $pull: { freinds: uid } });
        return res.status(200).json({
            status: "success",
            msg: "Friend removed successfully",
        });
    }
    catch (error) {
        console.error("Error removing friend:", error);
        return res.status(500).json({ status: "failed", msg: "Something went wrong" });
    }
});
exports.removeFreindController = removeFreindController;
