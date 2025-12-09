import express from 'express';
import { logCall, getCallHistory } from '../controllers/callLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/log').post(protect, logCall);

router.route('/history').get(protect, getCallHistory);

export default router;