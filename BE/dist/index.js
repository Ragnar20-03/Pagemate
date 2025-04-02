"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("./config/dotenv");
const app = (0, express_1.default)();
app.listen(dotenv_1.PORT, () => (console.log("Server started on port number : ", dotenv_1.PORT)));
