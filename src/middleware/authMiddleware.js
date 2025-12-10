import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';

const protect = async (req, res, next) => {
 
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
    let token = accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        throw new ApiError(401, 'Not authorized, token missing from cookie or header.');
    }
    
    try {
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    
        const decoded = jwt.verify(token, tokenSecret);

        req.user = await User.findById(decoded._id).select('-password -refreshToken');

        if (!req.user) {
            throw new ApiError(401, 'User not found or session expired.');
        }

        next();
    } catch (error) {
        throw new ApiError(401, 'Not authorized, token is invalid or expired.');
    }
};

export { protect };