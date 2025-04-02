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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("./config/dotenv");
const user_1 = require("./routes/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.router);
//@ts-ignore
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        msg: "Jay Ganesh ! from PageMate"
    });
}));
app.listen(dotenv_1.PORT, () => (console.log("Server started on port number : ", dotenv_1.PORT)));
