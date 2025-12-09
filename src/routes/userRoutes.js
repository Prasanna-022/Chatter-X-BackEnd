import express from 'express';
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getAllChatUsers,
    sendFriendRequest,
    getPendingRequests,
    respondToFriendRequest,
    askAI,
    updateUserStatus,
    updateUserProfile

} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();


router.route('/register').post(
    upload.fields([{ name: 'avatar', maxCount: 1 }]), 
    registerUser
);
router.route('/login').post(loginUser);
router.route('/logout').post(protect, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);


router.route('/current-user').get(protect, getCurrentUser);
router.route('/search').get(protect, getAllChatUsers); 
router.route('/details').put(protect, updateAccountDetails);
router.route('/password').put(protect, changeCurrentPassword);

router.route('/avatar').put(protect, upload.single('avatar'), updateUserAvatar);

router.route('/status').put(protect, updateUserStatus);

router.route('/friend/send').post(protect, sendFriendRequest);
router.route('/friend/respond').post(protect, respondToFriendRequest);
router.route('/friend/requests').get(protect, getPendingRequests);

router.route('/ai/ask').post(protect, askAI);
router.route('/profile').put(protect, upload.single('avatar'), updateUserProfile);
export default router;