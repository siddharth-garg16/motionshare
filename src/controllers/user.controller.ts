import asyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {username, email, fullName, password} = req.body;
    // validate data
    if([username, email, fullName, password].some((field) => field?.trim() === '')){
        res.status(400);
        throw new Error("Missing some required information");
    }

    // check for already existing users with similar credentials
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existingUser){
        res.status(409);
        throw new Error("Username or email already in use");
    }

    // get files path
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarPath = files.avatar?.[0]?.path;
    const coverPath = files.coverImage?.[0]?.path;
    if(!avatarPath){
        res.status(409);
        throw new Error("Avatar is required");
    }

    // get uploaded files reference
    const avatar = await uploadOnCloudinary(avatarPath);
    const coverImage = await uploadOnCloudinary(coverPath);

    const newUser = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const registeredUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!registeredUser){
        res.status(500);
        throw new Error('Something went wrong while registering')
    }

    res.status(201).json({
        status: 201,
        data: registeredUser,
        message: 'User registered successfully'
    })
})

export {registerUser}