const mongoose = require("mongoose");
const mcqSchema = new mongoose.Schema({
  branch: { type:String, required:true },
  subject: { type:String, required:true },
  question:{ type:String, required:true },
  options:[String],
  correctAnswer:String
});
mcqSchema.index({ branch:1, subject:1, question:1 }, { unique:true });
module.exports = mongoose.model("MCQ", mcqSchema);
