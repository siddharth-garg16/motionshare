import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";

const verifyJWT = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accesssToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            res.status(401);
            throw new Error("Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        if (typeof decodedToken === 'string' || !decodedToken._id) {
            res.status(401);
            throw new Error("Invalid token");
        }
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            res.status(401);
            throw new Error('Invalid access token');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Error");
    }
})

export { verifyJWT }