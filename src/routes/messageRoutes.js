import express from 'express';
import { sendMessage, allMessages, deleteMessage, sendVoiceMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.route('/').post(protect, sendMessage);

router.route('/:chatId').get(protect, allMessages);

router.route('/:messageId').delete(protect, deleteMessage);

router.route('/voice').post(protect, upload.single('audio'), sendVoiceMessage);

export default router;