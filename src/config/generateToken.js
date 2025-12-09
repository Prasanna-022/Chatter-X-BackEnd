import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // NOTE: JWT_SECRET is not in your env, which might be another issue. 
    // Using ACCESS_TOKEN_SECRET as a placeholder for deployment success.
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '30d',
    });
};

export default generateToken;