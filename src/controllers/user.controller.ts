import asyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";

const generateAccessAndRefreshToken = async(userId: string) => {
    try{
        const user = await User.findById(userId);
        const accesssToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accesssToken, refreshToken}
    }catch(error){
        throw new Error('Failed to process request');
    }
}

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

const loginUser = asyncHandler(async(req: Request, res: Response) => {
    const {email, username, password} = req.body;
    if(!email || !username){
        res.status(404);
        throw new Error('Email or username is required');
    }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(!existingUser){
        res.status(404);
        throw new Error("User doesn't exist");
    }
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        res.status(401);
        throw new Error('Invalid credentials');
    }
    const {accesssToken, refreshToken} = await generateAccessAndRefreshToken(existingUser._id)
    const loggedinUser = await User.findById(existingUser._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200).cookie("accessToken", accesssToken, options).cookie("refreshToken", refreshToken, options).json({user: loggedinUser, accesssToken, refreshToken});
})

const logoutUser = asyncHandler(async(req: Request, res: Response) => {
    await User.findByIdAndUpdate(req.user._id,
    {
        $set: {
            refreshToken: null
        }
    },
    {
        new: true
    })
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({message: "User logged out successfully"})
})

export {registerUser, loginUser, logoutUser}