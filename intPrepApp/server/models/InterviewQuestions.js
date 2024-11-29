// this model stores the questions for the interview prep, as well as any status/responses associated with them

const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    dateAsked: {
        type: Date,
        default: Date.now,
    },
});

const interviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

module.exports = interviewQuestion;