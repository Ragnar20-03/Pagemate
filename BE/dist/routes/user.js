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
exports.router = express_1.default.Router();
exports.router.post('/register', user_1.registerController);
exports.router.post('/login', user_1.loginController);
// router.post('/forgotPassword') // will be last
exports.router.post('/createClub', userMiddleware_1.userMiddleware, club_1.createClubController);
exports.router.post('/joinClub', userMiddleware_1.userMiddleware, club_1.joinClubController);
// router.post('/addBook',userMiddleware,)
exports.router.get('/getAllUsers', userMiddleware_1.userMiddleware, user_1.getAllUsers);
// router.post('/addFreind',userMiddleware,)
// router.post('/message',userMiddleware,) // will be also last
