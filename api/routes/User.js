import express from 'express'
import { acceptRequest, friendRequest, getFriendRequest, getUser, profileViews, suggestedFriends, updateUser } from '../controllers/usersController.js';
import { verifyuser } from '../utils/verifyToken.js';

const router = express.Router();

router.get("/getuser/:id" ,getUser)
router.put("/updateUser/:id", updateUser)
router.post("/friendrequest",friendRequest)
router.post("/getfriendrequest",getFriendRequest)
router.post("/acceptrequest",acceptRequest)
router.post("/profileviews",profileViews)
router.post("/sugestedfriends",suggestedFriends)


export default router;