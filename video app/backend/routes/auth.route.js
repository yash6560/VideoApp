const express = require('express')
const {signUp, logIn, logOut, onboard} = require('../controller/auth.controller');
const {protectedRoute} = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut);

router.post('/onboarding', protectedRoute, onboard);

//for checking if user is logged in
router.get('/me', protectedRoute, (req, res) => {
    return res.status(200).json({success: true, user: req.user});
});

module.exports = router;