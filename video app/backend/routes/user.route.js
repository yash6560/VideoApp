const express = require('express');
const { protectedRoute } = require('../middleware/auth.middleware');
const {getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutgoingFriendRequest} = require('../controller/user.controller');

const router = express.Router();

router.use(protectedRoute); // Apply protectedRoute middleware to all routes in this router

// router.get('/', protectedRoute, getRecomendedUsers);
// router.get('/friends', protectedRoute, getMyFriends);
router.get('/', getRecomendedUsers);
router.get('/friends', getMyFriends);

router.get('/friends-request/:id', sendFriendRequest);
router.get('/friends-request/:id/accept', acceptFriendRequest);

router.get('/friends-request', getFriendRequest);
router.get('/outgoing-friends-request', getOutgoingFriendRequest);

module.exports = router;