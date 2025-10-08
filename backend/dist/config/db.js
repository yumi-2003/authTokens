"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", true);
const connectToMongo = () => {
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then((obj) => {
        console.log("--- Successfully connected with database");
    })
        .catch((error) => {
        console.log("Invalid credentials ", error);
    });
};
exports.default = connectToMongo;
//# sourceMappingURL=db.js.map