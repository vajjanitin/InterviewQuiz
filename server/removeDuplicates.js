require("dotenv").config();
const mongoose = require("mongoose");
const MCQ = require("./models/MCQ"); // Change path if needed

async function removeDuplicates() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const duplicates = await MCQ.aggregate([
      {
        $group: {
          _id: { branch: "$branch", subject: "$subject", question: "$question" },
          ids: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    console.log(`Found ${duplicates.length} duplicate groups.`);

    for (const doc of duplicates) {
      doc.ids.shift(); // keep one
      await MCQ.deleteMany({ _id: { $in: doc.ids } });
    }

    console.log("Duplicate MCQs removed successfully.");
    process.exit();
  } catch (err) {
    console.error("Error removing duplicates:", err);
    process.exit(1);
  }
}

removeDuplicates();
