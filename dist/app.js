"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_constant_1 = require("./constants/cors.constant");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOptions = {
    origin: function (origin, callback) {
        if (cors_constant_1.allowedOrigins.indexOf(origin) !== 1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    }
};
const app = (0, express_1.default)();
exports.app = app;
// middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '200kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50kb' }));
app.use(express_1.default.static("assets"));
app.use((0, cookie_parser_1.default)());
app.get('/health', (req, res) => {
    const serverStatus = { serverStatus: 'Running' };
    res.json(serverStatus);
});
