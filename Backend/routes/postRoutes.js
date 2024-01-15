import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost ,replyToPost ,getFeedPost, getUserPosts } from "../controllers/postsController.js"
import protectRoute from "../middleware/protectRoute.js";

const router =express.Router();

router.get("/feed", protectRoute, getFeedPost)
router.get("/:id",getPost);
router.get("/user/:username",getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id",protectRoute,likeUnlikePost);
router.put("/reply/:id",protectRoute,replyToPost);


export default router;