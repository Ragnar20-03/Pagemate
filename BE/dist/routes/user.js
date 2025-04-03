"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const userMiddleware_1 = require("../middleware/userMiddleware");
const club_1 = require("../controller/club");
const book_1 = require("../controller/book");
const multer_1 = require("../config/multer");
exports.router = express_1.default.Router();
exports.router.post('/register', user_1.registerController);
exports.router.post('/login', user_1.loginController);
// router.post('/forgotPassword') // will be last
exports.router.post('/createClub', userMiddleware_1.userMiddleware, club_1.createClubController);
exports.router.post('/joinClub', userMiddleware_1.userMiddleware, club_1.joinClubController);
exports.router.post('/getAllClubs', userMiddleware_1.userMiddleware, club_1.getAllClubsController);
exports.router.post("/addBook/:clubId", userMiddleware_1.userMiddleware, multer_1.upload.single("book"), book_1.addBookController);
exports.router.get('/getAllUsers', userMiddleware_1.userMiddleware, user_1.getAllUsers);
exports.router.post('/addFreind', userMiddleware_1.userMiddleware, user_1.AddFreindController);
exports.router.post('/acceptRequest/:reqId', userMiddleware_1.userMiddleware, user_1.acceptFreindRequestController);
exports.router.post('/removeFreind/:friendId', userMiddleware_1.userMiddleware, user_1.removeFreindController);
// router.post('/message',userMiddleware,) // will be also last
