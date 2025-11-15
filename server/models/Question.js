const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  subject: { type: String, required: true },
  branch: { type: String, required: true }, // ✅ Added branch field
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard", "Advanced"], 
    default: "Medium" // difficulty field added for mode filtering
  },
});

module.exports = mongoose.model("Question", questionSchema);
