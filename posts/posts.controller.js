import express from "express";
import postService from './posts.service.js'

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
    const response = await postService.getAllPosts()
    
    res.send(response);
});

export default router;