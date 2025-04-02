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
exports.joinClubController = exports.createClubController = void 0;
const schema_1 = require("../db/schema");
const generateUniqueRoomCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    while (true) {
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }
        // Check if the code already exists in the database
        return code;
    }
});
const createClubController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uid = req.uid;
        const { clubName, validTill } = req.body;
        if (!clubName || !validTill) {
            return res.status(401).json({
                status: "failed",
                msg: "all feilds are necessary!"
            });
        }
        let roomCode = yield generateUniqueRoomCode();
        let newClub = yield schema_1.Club.create({ members: [], clubName, clubCode: roomCode, roomCode, validTill, isOpen: true, admin: uid });
        if (newClub) {
            return res.status(200).json({
                status: "success",
                msg: "Club Created Succesfully ",
                newClub
            });
        }
        else {
            return res.status(501).json({
                status: "failed",
                msg: "Club Created Failed ",
            });
        }
    }
    catch (err) {
        console.log("error is ....: ", err);
        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        });
    }
});
exports.createClubController = createClubController;
const joinClubController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.uid;
    const { clubName, clubCode } = req.body;
    let club = yield schema_1.Club.findOneAndUpdate({ clubCode, clubName }, { $addToSet: { members: uid } }, // Add user to members array (prevents duplicates)
    { new: true });
    if (club) {
        yield schema_1.User.findOneAndUpdate({ _id: uid }, { $addToSet: { joinedClubs: club._id } });
        return res.status(200).json({
            status: "success",
            msg: "club Joined Succesfully!",
            club
        });
    }
    else {
        return res.status(200).json({
            status: "failed",
            msg: "No Such Club",
        });
    }
});
exports.joinClubController = joinClubController;
