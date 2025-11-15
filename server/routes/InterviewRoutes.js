const express = require('express');
const router = express.Router();
const Question = require('../models/Question'); // Using the updated Question model

// GET endpoint to fetch a specific number of questions based on subject and branch
router.get('/questions', async (req, res) => {
  try {
    const { branch, subject, count } = req.query;

    // Validate the request parameters
    if (!branch || !subject || !count) {
      return res.status(400).json({ message: "Missing required parameters: branch, subject, or count." });
    }
    
    // Ensure count is a number
    const questionCount = parseInt(count, 10);
    if (isNaN(questionCount) || questionCount < 1) {
      return res.status(400).json({ message: "Invalid question count provided." });
    }
    
    // Find all questions that match the provided branch and subject
    const questions = await Question.find({ 
      branch: { $regex: new RegExp(branch, 'i') }, 
      subject: { $regex: new RegExp(subject, 'i') } 
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for the specified branch and subject." });
    }

    // Shuffle the questions to get a random selection
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
    // Slice the array to get the desired number of questions
    const selectedQuestions = shuffledQuestions.slice(0, questionCount);
    
    res.status(200).json(selectedQuestions);
  } catch (error) {
    console.error("Error fetching questions for interview:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
