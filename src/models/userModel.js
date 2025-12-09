import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true,lowercase: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
    },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date },
    refreshToken: { type: String }, 
    cloudinaryPublicId: { type: String, default: null },
    
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        sparse: true 
    } 
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

userSchema.statics.getAccessTokenSecret = function() {
    return process.env.ACCESS_TOKEN_SECRET;
};
userSchema.methods.isPasswordCorrect = userSchema.methods.matchPassword;


const User = mongoose.model('User', userSchema);
export default User;