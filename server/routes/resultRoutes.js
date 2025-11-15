const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// POST endpoint to submit/save quiz results
router.post('/submit', async (req, res) => {
    try {
        const { username, branch, subject, answers, score, total, timeTaken } = req.body;
        
        if (!username || !branch || !subject || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newResult = new Result({
            username,
            branch,
            subject,
            answers,
            score,
            total,
            timeTaken: timeTaken || 0,
        });

        const savedResult = await newResult.save();
        res.status(201).json(savedResult);
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ message: 'Server error while saving results' });
    }
});

// GET endpoint to retrieve a single quiz result by its ID
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Result.findById(id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found.' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching result by ID:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE endpoint to clear quiz results for a specific user
router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await Result.deleteMany({ username });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No results found to delete for this user.' });
        }
        
        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} result(s) for user ${username}` });
    } catch (error) {
        console.error("Error deleting results:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET endpoint for leaderboard with filtering
router.get('/leaderboard', async (req, res) => {
    try {
        const { branch, subject } = req.query;
        
        const matchCondition = {};
        if (branch) matchCondition.branch = branch;
        if (subject) matchCondition.subject = subject;

        const leaderboard = await Result.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { username: "$username", branch: "$branch", subject: "$subject" },
                    maxScore: { $max: "$score" },
                    minTime: { $min: "$timeTaken" },
                }
            },
            {
                $project: {
                    _id: 0,
                    username: "$_id.username",
                    branch: "$_id.branch",
                    subject: "$_id.subject",
                    maxScore: 1,
                    timeTaken: "$minTime"
                }
            },
            { $sort: { maxScore: -1, timeTaken: 1 } }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;