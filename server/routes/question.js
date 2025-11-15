const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Bulk insert questions
router.post("/bulk", async (req, res) => {
  try {
    const questions = req.body.questions;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data" });
    }

    await Question.insertMany(questions);
    res.status(201).json({ 
      message: "Questions inserted successfully",
      count: questions.length 
    });
  } catch (error) {
    console.error("Error inserting questions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get questions by subject with optional difficulty filter
router.get("/:subject", async (req, res) => {
  try {
    const subject = req.params.subject.toLowerCase();
    const count = parseInt(req.query.count) || 10;
    const difficulty = req.query.difficulty; // Optional: Easy, Medium, Hard, Advanced

    // difficulty field added for mode filtering
    let matchStage = { subject: { $regex: new RegExp(`^${subject}$`, 'i') } };
    
    if (difficulty) {
      matchStage.difficulty = difficulty;
    }

    // Get total count of matching questions
    const totalQuestions = await Question.countDocuments(matchStage);

    if (totalQuestions === 0) {
      // If no questions with specified difficulty, try fallback strategy
      if (difficulty) {
        console.log(`⚠️  No questions found for difficulty '${difficulty}', attempting fallback...`);
        
        // Fallback difficulty hierarchy: Hard -> Medium -> Easy
        const difficultyFallbacks = {
          "Advanced": ["Hard", "Medium", "Easy"],
          "Hard": ["Medium", "Easy"],
          "Medium": ["Easy"]
        };

        const fallbackDifficulties = difficultyFallbacks[difficulty] || [];

        for (const fallbackDiff of fallbackDifficulties) {
          const fallbackMatch = { 
            ...matchStage, 
            difficulty: fallbackDiff 
          };
          const fallbackCount = await Question.countDocuments(fallbackMatch);
          
          if (fallbackCount > 0) {
            console.log(`✅ Falling back to difficulty '${fallbackDiff}'`);
            matchStage = fallbackMatch;
            break;
          }
        }

        const finalCount = await Question.countDocuments(matchStage);
        if (finalCount === 0) {
          // If still no questions, remove difficulty filter entirely
          matchStage = { subject: { $regex: new RegExp(`^${subject}$`, 'i') } };
        }
      } else {
        return res.status(404).json({ message: `No questions found for subject: ${subject}` });
      }
    }

    // Use MongoDB aggregation to randomly select questions
    const finalQuestionCount = await Question.countDocuments(matchStage);
    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: Math.min(count, finalQuestionCount) } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: `No questions found matching criteria` });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;