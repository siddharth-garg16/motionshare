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
exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = require("../models/user.model");
const cloudinary_1 = require("../utils/cloudinary");
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { username, email, fullName, password } = req.body;
    // validate data
    if ([username, email, fullName, password].some((field) => (field === null || field === void 0 ? void 0 : field.trim()) === '')) {
        res.status(400);
        throw new Error("Missing some required information");
    }
    // check for already existing users with similar credentials
    const existingUser = yield user_model_1.User.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) {
        res.status(409);
        throw new Error("Username or email already in use");
    }
    // get files path
    const files = req.files;
    const avatarPath = (_b = (_a = files.avatar) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
    const coverPath = (_d = (_c = files.coverImage) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
    // get uploaded files reference
    const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(avatarPath);
    const coverImage = yield (0, cloudinary_1.uploadOnCloudinary)(coverPath);
    const newUser = yield user_model_1.User.create({
        fullName,
        avatar: (avatar === null || avatar === void 0 ? void 0 : avatar.url) || "",
        coverImage: (coverImage === null || coverImage === void 0 ? void 0 : coverImage.url) || "",
        email,
        password,
        username: username.toLowerCase()
    });
    const registeredUser = yield user_model_1.User.findById(newUser._id).select("-password -refreshToken");
    if (!registeredUser) {
        res.status(500);
        throw new Error('Something went wrong while registering');
    }
    res.status(201).json({
        status: 201,
        data: registeredUser,
        message: 'User registered successfully'
    });
}));
exports.registerUser = registerUser;
