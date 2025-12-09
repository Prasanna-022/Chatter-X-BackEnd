import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';



dotenv.config();
connectDB();
configureCloudinary();

const app = express();
app.use(express.json({ limit: '16kb' })); 
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://chatter-x-frontend.vercel.app/",
    credentials: true,
}));         

app.use(apiResponse);

import connectDB from './src/config/db.js'; 

import userRoutes from './src/routes/userRoutes.js'; 
import chatRoutes from './src/routes/chatRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import callLogRoutes from './src/routes/callLogRoutes.js';
import healthcheckRoutes from './src/routes/healthcheckRoutes.js';

import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import { apiResponse } from './src/utils/apiResponse.js';

import { configureCloudinary } from './src/utils/cloudinary.js';


app.get('/', (req, res) => {
    res.standardSuccess(null, 'NovaChat API is running successfully');
});

app.use('/healthcheck', healthcheckRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);
app.use('/call', callLogRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

import { Server } from "socket.io";

const io = new Server(server, {
    pingTimeout: 60000, 
    cors: {
        origin: process.env.CORS_ORIGIN || "https://chatter-x-frontend.vercel.app/", 
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
    });
    
    socket.on("new_message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return;

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return; 
            socket.in(user._id.toString()).emit("message_received", newMessageReceived);
        });
    });

    socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
    socket.on("stop_typing", (chatId) => socket.in(chatId).emit("stop_typing"));
    
    socket.on("call_user", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall.toString()).emit("call_user", { signal: signalData, from, name });
    });

    socket.on("answer_call", (data) => {
        io.to(data.to.toString()).emit("call_accepted", data.signal);
    });
    
    socket.on("end_call", (data) => {
        io.to(data.to.toString()).emit("call_ended");
    });

    socket.off("setup", (userData) => {
        if (userData && userData._id) {
            console.log("USER DISCONNECTED:", userData._id);
            socket.leave(userData._id.toString());
        }
    });
});