// stores the user's progress (which questions have been reviewed/which anagram groups a user has completed)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique:  true,
    },
    reviewedQuestions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion' }
    ],
    completedAnagrams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anagram'}
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;