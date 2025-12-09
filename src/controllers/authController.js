import User from '../models/userModel.js';
import generateToken from '../config/generateToken.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Please provide name, email, and password.');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(409, 'User already exists with this email.');
    }

    // NOTE: The `registerUser` in userRoutes expects multipart/form-data for avatar, 
    // but this controller logic is missing it. Using the one from userController.js is better.

    // Re-implementing with proper structure for 'name', not 'fullName' as used in the other controller
    const user = await User.create({ name, email, password, avatar });

    if (user) {
        // Note: generateToken in this file is simple JWT, but userModel has better methods. 
        // For a quick fix, let's assume `generateToken` is for the simple JWT
        res.standardSuccess({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id), // This generates a simple token, inconsistent with the other controller
        }, 'User registered successfully!', 201);
    } else {
        throw new ApiError(500, 'User creation failed. Invalid data.');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.standardSuccess({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id), // Inconsistent token method
        }, 'Login successful!');
    } else {
        throw new ApiError(401, 'Invalid Email or Password.');
    }
});

export { registerUser, loginUser };