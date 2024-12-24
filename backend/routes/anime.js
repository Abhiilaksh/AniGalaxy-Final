const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Comment } = require("../db");

const SECRET_KEY = "AnigalaxybyAbhilaksh";

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

// Middleware for input validation
const validateCommentInput = (req, res, next) => {
    const { animeId, name, comment } = req.body;

    if (!animeId || !name || !comment) {
        return res.status(400).json({ error: "Anime ID, name, and comment are required" });
    }

    if (!comment.trim()) {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    next();
};



// POST: Add a comment for a specific anime
router.post("/comment", authenticateToken, validateCommentInput, async (req, res) => {
    try {
        const { animeId, name, comment } = req.body;  
        const newComment = new Comment({ animeId, name, comment: comment.trim() });
        await newComment.save();

        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch comments for a specific anime
router.get("/comment", async (req, res) => {
    try {
        const { animeId } = req.query;

        if (!animeId) {
            return res.status(400).json({ error: "Anime ID is required" });
        }

        const comments = await Comment.find({ animeId });
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
