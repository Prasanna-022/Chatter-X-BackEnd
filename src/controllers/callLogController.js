import CallLog from '../models/callLogModel.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/userModel.js';

const logCall = asyncHandler(async (req, res) => {
    const { recipientId, type, duration = 0, status = 'missed' } = req.body;
    const callerId = req.user._id;

    if (!recipientId || !type) {
        throw new ApiError(400, 'Missing recipientId or call type.');
    }

    if (!['voice', 'video'].includes(type)) {
        throw new ApiError(400, 'Invalid call type.');
    }
    
    if (!(await User.findById(recipientId))) {
        throw new ApiError(404, 'Recipient user does not exist.');
    }

    const logEntry = await CallLog.create({
        caller: callerId,
        recipient: recipientId,
        type,
        duration,
        status,
    });

    res.standardSuccess(logEntry, 'Call successfully logged.', 201);
});

const getCallHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const history = await CallLog.find({
        $or: [{ caller: userId }, { recipient: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('caller', 'fullName avatar')
    .populate('recipient', 'fullName avatar');

    res.standardSuccess(history, 'Call history fetched successfully.');
});

export { logCall, getCallHistory };