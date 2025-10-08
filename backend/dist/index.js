"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load environment variables first
const app = (0, express_1.default)();
// ✅ Connect to MongoDB after environment is loaded
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
// ✅ Enable CORS for cross-origin requests
app.use((0, cors_1.default)());
// ✅ Parse JSON payloads
app.use(express_1.default.json());
// ✅ Basic API endpoint
app.get("/", (req, res) => {
    res.send("API is working....");
});
// ✅ Authentication routes
app.use("/api", user_1.default);
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`---- Connected with Express server on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map