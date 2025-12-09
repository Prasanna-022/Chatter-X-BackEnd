// NEW CODE for backend/middleware/errorMiddleware.js (Fixes the error)
import ApiError from '../utils/ApiError.js';

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode;

    if (statusCode === 200) {
        statusCode = 500;
    }

    if (!(err instanceof ApiError)) {
        err = new ApiError(statusCode, err.message, err.errors, err.stack);
    }

    res.status(err.statusCode).json({
        success: err.success, 
        message: err.message,
        errors: err.errors,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};


export { notFound, errorHandler };