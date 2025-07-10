const userModel = require('../models/user.models');
const FriendRequestModel = require('../models/friendRequest.model');

const getRecomendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await userModel.find({
            $and: [
                {_id: {$ne : currentUserId}}, // Exclude current user
                {_id: {$nin : currentUser.friends}}, // Exclude friends of current user
                {isOnboarded: true}, // Only include users who have completed onboarding
            ]
        })

        return res.status(200).json({
            message: "Recommended users fetched successfully",
            data: recommendedUsers,
        });

    } catch (error) {
        console.error("Error in getRecomendedUsers:", error);
        return res.status(500).json({ error: "Internal Server Error in getrecommended friends" });
    }
}

const getMyFriends = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('friends').populate('friends', 'fullName email profilePic nativeLanguage learningLanguage location bio');

        return res.status(200).json({
            message: "Friends fetched successfully",
            data: user.friends,
        });
    } catch (error) {
        console.error("Error in getMyFriends:", error);
        return res.status(500).json({ error: "Internal Server Error in getMyFriends" });
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const {id:recipientId} = req.params;
        const senderId = req.user._id;

        //prevent sending friend request to self
        if (recipientId === senderId) {
            return res.status(400).json({ error: "You cannot send a friend request to yourself." });
        }

        // Check if the recipient exists
        const recipient = await userModel.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ error: "Recipient not found." });
        }
        // Check if the recipient is already a friend
        if(recipient.friends.includes(senderId)) {
            return res.status(400).json({ error: "You are already friends with this user." });
        }
        // Check if a friend request already exists
        const existingRequest = await FriendRequestModel.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: "Friend request already sent." });
        }

        // Create a new friend request
        const newFriendRequest = await FriendRequestModel.create({
            sender: senderId,
            recipient: recipientId,
        });

        return res.status(201).json(newFriendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest:", error);
        return res.status(500).json({ error: "Internal Server Error in sendFriendRequest" });
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const {id:requestId} = req.params;
        const senderId = req.user._id;

        const friendRequest = await FriendRequestModel.findById(requestId);
        if(!friendRequest) {
            return res.status(404).json({ error: "Friend request not found." });
        }   

        // Check if the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== senderId.toString()) {
            return res.status(403).json({ error: "You are not authorized to accept this friend request." });
        }

        // Update the friend request status to accepted
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add each user to the other's friends list
        //addtoset is method to avoid duplicates
        await userModel.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await userModel.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        return res.status(200).json({
            message: "Friend request accepted successfully"
        });

    } catch (error) {
        console.error("Error in acceptFriendRequest:", error);
        return res.status(500).json({ error: "Internal Server Error in acceptFriendRequest" });
    }
}

const getFriendRequest = async (req, res) => {
    try {
        const incomingReqs = await FriendRequestModel.find({
            recipient: req.user._id,
            status: "pending",
        }).populate('sender', 'fullName email profilePic nativeLanguage learningLanguage location bio');

        const acceptedReqs = await FriendRequestModel.find({
            sender: req.user._id,
            status: "accepted",
        }).populate('recipient', 'fullName profilePic');

        return res.status(200).json({
            message: "Friend requests fetched successfully",
            data: {
                incomingReqs,
                acceptedReqs,
            },
        });


    } catch (error) {
        console.error("Error in getFriendRequest:", error);
        return res.status(500).json({ error: "Internal Server Error in getFriendRequest" });
    }
}

const getOutgoingFriendRequest = async (req, res) => {
    try {
        const outgoingReqs = await FriendRequestModel.find({
            sender: req.user._id,
            status: "pending",
        }).populate('recipient', 'fullName email profilePic nativeLanguage learningLanguage location bio');

        return res.status(200).json({
            message: "Outgoing friend requests fetched successfully",
            outgoingReqs,
        });
        
    } catch (error) {
        console.log("Error in getOutgoingFriendRequest:", error);
        return res.status(500).json({ error: "Internal Server Error in getOutgoingFriendRequest" });
    }
}

module.exports = {getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutgoingFriendRequest};