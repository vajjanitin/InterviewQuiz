const MCQ = require("../models/MCQ");

exports.addMCQ = async (req, res) => {
  const { branch, subject, question, options, correctAnswer } = req.body;
  if (!branch || !subject || !question || !options?.length || !correctAnswer) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const mcq = new MCQ({ branch, subject, question, options, correctAnswer });
  await mcq.save();
  res.status(201).json({ message: "MCQ added", mcq });
};

exports.fetchMCQs = async (req, res) => {
  const { branch, subject, count } = req.body;
  if (!branch || !subject || !count) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const total = await MCQ.countDocuments({ branch, subject });
  const size = Math.min(parseInt(count), total);
  const mcqs = await MCQ.aggregate([
    { $match: { branch, subject } },
    { $sample: { size } },
  ]);
  res.json(mcqs);
};
