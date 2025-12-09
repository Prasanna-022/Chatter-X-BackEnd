
const apiResponse = (req, res, next) => {
    res.standardSuccess = (data, message = "Success", status = 200) => {
        return res.status(status).json({
            success: true,
            message: message,
            data: data
        });
    };
    next();
};

export { apiResponse };