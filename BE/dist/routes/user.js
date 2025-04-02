"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.post('/register');
exports.router.post('/login');
exports.router.post('/forgotPassword'); // will be last
exports.router.post('/createClub');
exports.router.post('/joinClub');
exports.router.post('/addBook');
exports.router.get('/getAllUsers');
exports.router.post('/addFreind');
exports.router.post('/message'); // will be also last
