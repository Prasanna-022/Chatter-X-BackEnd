import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import FriendRequest from '../models/friendRequestModel.js';

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "Recipient ID is missing in the request body.");
    }
    
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password -cloudinaryPublicId -refreshToken").populate("latestMessage");

    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "fullName avatar email",
    });

    if (isChat.length > 0) {
        res.standardSuccess(isChat[0]);
        return;
    } 

    
    const friendshipStatus = await FriendRequest.findOne({
        $or: [
            { sender: req.user._id, recipient: userId },
            { sender: userId, recipient: req.user._id }
        ],
        status: 'accepted' 
    });

    if (!friendshipStatus) {
        throw new ApiError(403, "Chat can only be initiated between accepted friends.");
    }
    
    var chatData = {
        chatName: "Direct Chat",
        isGroupChat: false,
        users: [req.user._id, userId],
    };

    try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password -cloudinaryPublicId -refreshToken");
        res.standardSuccess(fullChat, "New chat created successfully.", 201);
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password -cloudinaryPublicId -refreshToken")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        
        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "fullName avatar email",
        });
        
        res.standardSuccess(populatedResults, "Chats fetched successfully.");
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export { accessChat, fetchChats };