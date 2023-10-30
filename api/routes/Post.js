import express from 'express';
import { 
    commentPost,
    createPost,
    deletePost,
    getComments,
    getPost,
    getPosts,
    getUserPost,
    likePost,
    likePostComment,
    replyPostComment,    
  } from '../controllers/postController.js';
import { verifyuser } from '../utils/verifyToken.js';

const router = express.Router();

router.post("/create-post", createPost);
router.get("/:id", getPost);
router.post("/", getPosts);
router.get("/get-user-post/:id", getUserPost);
router.post("/like/:id", likePost);
router.post("/like-comment/:id/:rid?", likePostComment);
router.post("/reply-comment/:id", replyPostComment);
router.post("/comment/:id", commentPost);
router.get("/comments/:postId", getComments);
router.delete("/:id", deletePost);

export default router;
