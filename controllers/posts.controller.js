import express from "express";
import postService from '../services/posts.service.js'

const router = express.Router();

// Get all posts
router.get("/", (req, res) => {
    const response = postService.getAllPosts()
    res.send(response);
});

export default router;