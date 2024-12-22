const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Comment } = require("../db");

const SECRET_KEY = "AnigalaxybyAbhilaksh";

// POST: Add a comment for a specific anime
router.post("/comment",  async (req, res) => {
    const { animeId, episodeId, name, comment } = req.body;

    // Validate request body
    if (!animeId || !episodeId || !name || !comment?.trim()) {
        return res.status(400).json({ error: "Anime ID, episode ID, name, and comment are required" });
    }

    try {
        // Save the comment to the database
        const newComment = new Comment({
            animeId,
            episodeId,
            name,
            comment: comment.trim(),
        });
        await newComment.save();

        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// GET: Fetch comments for a specific anime
router.get("/comment", async (req, res) => {
    const { animeId, episodeId } = req.body;

    if (!animeId || !episodeId) {
        return res.status(400).json({ error: "Anime ID and episode ID are required" });
    }

    try {
        const comments = await Comment.find({ animeId, episodeId });
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
