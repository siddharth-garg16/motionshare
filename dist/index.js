"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5999;
const allowedOrigins = ['https://testdomain.com', 'http://127.0.0.1'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== 1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    }
};
const runServer = () => {
    app.use((0, cors_1.default)(corsOptions));
    app.listen(PORT, () => {
        console.log(`motionshare server is listening on PORT: ${PORT}`);
    });
};
app.get('/', (req, res) => {
    const serverStatus = { serverStatus: 'Running' };
    res.json(serverStatus);
});
runServer();
