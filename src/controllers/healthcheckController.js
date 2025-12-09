import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const healthcheck = asyncHandler(async (req, res) => {
   
    const dbStatus = mongoose.connection.readyState === 1 ? "UP" : "DOWN";

    const response = {
        server_status: "UP",
        db_status: dbStatus,
        message: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };

    if (dbStatus === "DOWN") {
        res.status(503).json(response); 
        return;
    }

    res.standardSuccess(response, "Service is healthy and ready.", 200);
});

export { healthcheck };