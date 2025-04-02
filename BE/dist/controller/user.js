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
exports.AddFreindController = exports.getAllUsers = exports.loginController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const dotenv_1 = require("../config/dotenv");
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
});
exports.AddFreindController = AddFreindController;
