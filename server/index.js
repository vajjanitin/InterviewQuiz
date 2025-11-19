require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/mcq", require("./routes/mcqRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/interview", require("./routes/InterviewRoutes")); // ✅ New route for fetching interview questions

// Health check endpoint for platform probes and quick debugging
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// Debug: show the runtime PORT value (helps diagnose Render deployments)
console.log("Runtime process.env.PORT:", process.env.PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
