const Result = require("../models/Result");
const nodemailer = require("nodemailer");

exports.submitResult = async (req, res) => {
  const { userEmail, branch, subject, score, total, answers } = req.body;
  if (!userEmail || !branch || !subject || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const result = new Result({ username: userEmail, branch, subject, score, total, answers });
  await result.save();

  // send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Your ${subject} Quiz Report`,
    html: `<h2>Branch: ${branch}</h2>
           <p>Score: ${score} / ${total}</p>
           ${answers.map((a, i) => `
             <p><b>Q${i+1}:</b> ${a.question} <br/>
                <b>Your:</b> ${a.selectedOption} <br/>
                <b>Correct:</b> ${a.correctAnswer} <br/>
                <b>${a.isCorrect ? "✅ Correct":"❌ Incorrect"}</b>
             </p>`).join("")}`
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: "Result saved and emailed" });
};
