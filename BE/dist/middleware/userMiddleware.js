"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const dotenv_1 = require("../config/dotenv");
dotenv_1.JWT_SECRETE;
schema_1.User;
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined in .env
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("Request URL:", req.originalUrl);
        // **Check for token in both cookies & Authorization header**
        let token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
        console.log("Token received:", token);
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized Request!" });
        }
        // **Verify the token**
        let verifiedToken = jsonwebtoken_1.default.verify(token, dotenv_1.JWT_SECRETE);
        if (!verifiedToken || !verifiedToken.uid) {
            return res.status(401).json({ msg: "Unauthorized Request!" });
        }
        // **Find user in DB to confirm existence**
        let userExists = yield schema_1.User.findById(verifiedToken.uid);
        if (!userExists) {
            return res.status(401).json({ msg: "User not found, Unauthorized Request!" });
        }
        // **Attach `uid` to the request for further use**
        req.uid = verifiedToken.uid;
        next();
    }
    catch (error) {
        console.log("Error in userMiddleware:", error);
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ msg: "Token expired. Please log in again." });
        }
        return res.status(500).json({ msg: "Unauthorized Request!" });
    }
});
exports.userMiddleware = userMiddleware;
