const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Comment } = require("../db");

const SECRET_KEY = "AnigalaxybyAbhilaksh";

// POST: Add a comment for a specific anime
router.post("/comment", async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(403).json({ error: "Invalid token" });
        }

        // Extract comment data from the request body
        const { animeId, name, comment } = req.body;

        // Check if required fields are present
        if (!animeId || !name || !comment) {
            return res.status(400).json({ error: "Anime ID, name, and comment are required" });
        }

        // Trim whitespace from comment
        const trimmedComment = comment.trim();
        if (!trimmedComment) {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }

        // Create a new comment in the database
        const newComment = new Comment({ animeId, name, comment: trimmedComment });
        await newComment.save();

        // Return the new comment in the response
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
        console.log(animeId);

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
