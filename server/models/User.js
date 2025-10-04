// stores the user's progress (which questions have been reviewed/which anagram groups a user has completed)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Import the validator package


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'user'
  },
  reviewedQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
      default: []
    }
  ],
  completedAnagrams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anagram',
      default: []
    }
  ],
  // tracks each user's daily anagram activity
  anagramProgress: [
    {
      date: { type: String, required: true },        // e.g., "2025-07-18"
      topic: { type: String },                       // e.g., "Node.js"
      totalCorrect: { type: Number, default: 0 },
      totalAttempted: { type: Number, default: 0 },
      roundCompleted: { type: Boolean, default: false }
    }
  ],

  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Individual anagram session schema
const AnagramSessionSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  topic: { type: String, default: 'All' },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date, required: true },
  durationMs: { type: Number, required: true },
  totalAttempted: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  accuracyPct: { type: Number, required: true }, // 0..1
  targetCount: { type: Number, default: 25 },
}, { _id: false });

// Aggregated stats schema
const AnagramStatsSchema = new mongoose.Schema({
  totalSetsCompleted: { type: Number, default: 0 },
  bestAccuracy: { type: Number, default: 0 },
  avgAccuracy: { type: Number, default: 0 },
  bestAvgTimeMs: { type: Number, default: null },
  avgTimeMs: { type: Number, default: null },
}, { _id: false });

// Append to main userSchema
userSchema.add({
  anagramSessions: { type: [AnagramSessionSchema], default: [] },
  anagramStats: { type: AnagramStatsSchema, default: () => ({}) },
});


// password hashing pre-save middleware
userSchema.pre('save' , async function(next) {
        if (this.isModified("password")) {
        // Prevent double hashing
        const bcryptHashRegex = /^\$2[aby]\$\d{2}\$/; 
        
        if (!bcryptHashRegex.test(this.password)) {
            console.log("Hashing password before saving...");
            this.password = await bcrypt.hash(this.password,10);
        } else {
            console.log("Password is already hashed, skipping hashing...");
        }
    }
    next();
});


// method for password comparison
userSchema.methods.isCorrectPassword = async function (password) {
    try {
    return bcrypt.compare(password, this.password);
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;