"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_connection_1 = __importDefault(require("./db/db.connection"));
const app_1 = require("./app");
dotenv_1.default.config();
(0, db_connection_1.default)()
    .then(() => {
    runServer();
})
    .catch((err) => {
    console.log(err);
});
const runServer = () => {
    const PORT = process.env.PORT || 5999;
    app_1.app.listen(PORT, () => {
        console.log(`motionshare server is listening on PORT: ${PORT}`);
    });
};
