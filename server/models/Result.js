const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  branch: { type: String, required: true },
  subject: { type: String, required: true },
  answers: [
    {
      question: String,
      selectedOption: String,
      correctAnswer: String,
      isCorrect: Boolean,
    },
  ],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 }, // ✅ Added timeTaken field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);