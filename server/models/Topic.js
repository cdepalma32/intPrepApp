const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    description: { // for option to add a description for each topic
        type: String,
        default: null, // optional field with no default value
    },
    interviewQuestions: [
        {
            type: Schema.Types.ObjectId, // reference to InterviewQuestion model
            ref: 'InterviewQuestion',
        }
    ],
    anagrams: [
        {
            type: Schema.Types.ObjectId, // reference to anagram model
            ref: 'Anagram',
        }
    ], 
}, {timestamps: true});


const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;