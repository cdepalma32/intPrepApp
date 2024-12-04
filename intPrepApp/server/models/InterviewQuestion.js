// this model stores the questions for the interview prep, as well as any status/responses associated with them

const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true, // the question text
    },
    correctAnswer: {
        type: String,
        required: true, // the correct answer to the question
        trim: true,
    },
    isAnswered: {
        type: Boolean,
        default: false, // indicates whether the question has been answered
    },
    dateAsked: {
        type: Date,
        default: Date.now, // the date the question was created
    },
}, { timestamps: true });

const interviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

module.exports = interviewQuestion;