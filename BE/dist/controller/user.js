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
exports.AddFreindController = exports.getAllUsers = exports.loginController = exports.registerController = void 0;
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, password } = req.body;
        if (!fname || !lname || !email || !password) {
            return res.status(501).json({
                status: "failed",
                msg: "AllFeilds are necessary !",
            });
        }
    }
    catch (err) {
        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.loginController = loginController;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getAllUsers = getAllUsers;
const AddFreindController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.AddFreindController = AddFreindController;
