const express = require('express')
const {signUp, logIn, logOut, onboard} = require('../controller/auth.controller');
const {protectedRoute} = require('../middleware/auth.middleware');
const userModel = require('../models/user.models');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut);

router.post('/onboarding', protectedRoute, onboard);

//for checking if user is logged in
router.get('/me', protectedRoute, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({success: true, user});
    } catch (error) {
        console.log('Error in /me:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;