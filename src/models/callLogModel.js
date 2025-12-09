import mongoose from 'mongoose';

const callLogSchema = mongoose.Schema(
    {
        caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { 
            type: String, 
            enum: ['voice', 'video'],
            required: true 
        },
        duration: { type: Number, default: 0 }, 
        status: { 
            type: String, 
            enum: ['completed', 'missed', 'failed'],
            default: 'missed' 
        },
    },
    { timestamps: true }
);

const CallLog = mongoose.model('CallLog', callLogSchema);
export default CallLog;