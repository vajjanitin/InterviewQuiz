const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

/**
 * Migration script to populate existing questions with difficulty values.
 * 
 * This script handles questions that lack the difficulty field by:
 * 1. Finding all questions without a difficulty field
 * 2. Evenly distributing them among the four difficulty levels (Easy, Medium, Hard, Advanced)
 * using a round-robin strategy
 * 
 * TODO: This is an approximate seed distribution. Refine difficulty assignments manually
 * based on actual question content and complexity for better accuracy.
 */

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Advanced"];

async function migrateDifficulty() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all questions without difficulty field
    const questionsWithoutDifficulty = await Question.find({ difficulty: { $exists: false } });
    
    if (questionsWithoutDifficulty.length === 0) {
      console.log('✅ All questions already have difficulty values assigned!');
      process.exit(0);
    }

    console.log(`\n📝 Found ${questionsWithoutDifficulty.length} questions without difficulty field`);
    console.log('🔄 Applying round-robin difficulty distribution...\n');

    // Apply round-robin distribution
    const updateOperations = questionsWithoutDifficulty.map((question, index) => {
      const difficulty = DIFFICULTIES[index % DIFFICULTIES.length];
      return {
        updateOne: {
          filter: { _id: question._id },
          update: { $set: { difficulty } }
        }
      };
    });

    await Question.bulkWrite(updateOperations);

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Difficulty distribution (round-robin):`);
    
    // Show distribution
    for (const difficulty of DIFFICULTIES) {
      const count = await Question.countDocuments({ difficulty });
      console.log(`   - ${difficulty}: ${count} questions`);
    }

    console.log('\n⚠️  NOTE: This is an approximate seed distribution.');
    console.log('   Please manually review and refine difficulty assignments based on');
    console.log('   actual question content and complexity for better accuracy.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateDifficulty();
