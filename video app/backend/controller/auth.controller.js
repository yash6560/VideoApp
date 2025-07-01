const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const streamClient = require('../lib/stream');

const signUp = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length <6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Email is not valid"});
        }

        // Check if user already exists
        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User already exists"});
        }

        //generate a random number between 1 and 100 for the user profile
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await userModel.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        });

        //create user in stream as well for videocall
        await streamClient.upsertUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic,
        })

        //generate Token for streamuser
        // const streamToken = streamClient.createToken(newUser._id.toString());

        const token = await jwt.sign({userID: newUser._id}, process.env.JWT_SECRET,  {
            expiresIn : "7d",
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite : "strict",
            secure: process.env.NODE_ENV === "production",
        })

        return res.status(201).json({success: true, message: "User created successfully"});

    } catch (error) {
        console.log("signup error : ", error);
        return res.status(500).json({message: "Internal server error in signup"});
    }
}

const logIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalide email or password"});
        }  

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = await jwt.sign({userID: user._id}, process.env.JWT_SECRET, {
            expiresIn : "7d",
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite : "strict",
            secure: process.env.NODE_ENV === "production",
        })

        return res.status(200).json({success: true, message: "User login successfully"});

    } catch (error) {
        console.log("login error : ", error);
        return res.status(500).json({message: "Internal server error in login"});
    }
}

const logOut = (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({success: true, message: "User logged out successfully"});
}

const onboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ],
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            isOnboarded: true,
        }, {new: true});

        if(!updatedUser) {
            return res.status(404).json({message: "User not updated"});
        }
        
        // update user in stream as well for videocall
        streamClient.upsertUser({
            id : updatedUser._id.toString(),
            name : updatedUser.fullName,
            language : updatedUser.nativeLanguage
        })

        return res.status(200).json({
            success: true,
            message: "User onboarded successfully", user: updatedUser});


    } catch (error) {
        console.log("onboard error : ", error);
        return res.status(500).json({message: "Internal server error in onboard"});
    }
}

module.exports = {signUp, logIn, logOut, onboard}