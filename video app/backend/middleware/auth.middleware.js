const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Unauthorized access, token is missing"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded.userID){
            return res.status(401).json({message: "Unauthorized access, invalid token"});
        }

        const user = await userModel.findById(decoded.userID).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.log("Protected route error: ", error);
        return res.status(500).json({message: "Internal server error in protected route"});
    }
}

module.exports = { protectedRoute };