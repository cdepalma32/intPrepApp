const mongoose = require('mongoose');
const Question = require('../models/InterviewQuestion');

const getQuestion = async (req, res) => {
    try {
        const { topicId } = req.params;
        // logic to fetch questions for the topic
        const questions = await Question.find({ topic: topicId }); 
        if (!questions || questions.length === 0) {
            return res.status(404).json({ success: false, error: 'No questions found for this topic.'});
        }
        res.status(200).json({ success: true, questions});
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch interview questions.'})
    }
    };

const submitAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { answer } = req.body;
        // authentication check : ensure user is authenticated
        if (!req.user || req.user.role !== 'student') { 
            return res.status(403).json({ success: false, error: 'Unauthorized access.'});
        }
        // validate answer input
        if (!answer || typeof answer !== 'string' || !answer.trim()) {
            return res.status(400).json({success: false, error: 'Answer cannot be empty.'})
        }

        const question = await Question.findById(questionId); 
        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found!'});
        }

        // normalize answers for comparison
        const submittedAnswer = (answer || '').toLowerCase().trim();
        const correctAnswer = (question.correctAnswer || '').toLowerCase().trim();
        const isCorrect = submittedAnswer === correctAnswer;

        // logic to submit an answer
        res.status(200).json({ success: true, isCorrect });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ success: false, error: 'Failed to submit answer.'});
    }
    };

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, topicId, correctAnswer } = req.body;
        // authentication check : ensure user is authenticate
        
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized accesss.'});
        }
        if ( 
            typeof question !== 'string' || !question.trim() ||
            !mongoose.Types.ObjectId.isValid(topicId) || // ensures valid object id
            typeof correctAnswer !== 'string' || !correctAnswer.trim()
        ) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid input. Ensure question and correctAnswer are strings and topicId is a valid ObjectId.' 
            });
        } 

        // logic to update a question
        const updatedQuestion = await Question.findByIdAndUpdate (
            id, // match id
            { question, topicId, correctAnswer }, // update fields
            { new: true, runValidators: true } // return updated doc & validate fields
        );
        if (!updatedQuestion) {
            return res.status(404).json({success: false, error: 'Question not found.'});
        }
        res.status(200).json({ success: true, message: `Interview question ${id} updated successfully!`, updatedQuestion });
    } catch (error) {
        console.error(`[UPDATE QUESTION ERROR] ID: ${id} ${error.message} `); // log error
        res.status(500).json({ success: false, error: 'Failed to update interview question.'});
    }
    };

    const createQuestion = async (req, res) => {
        try {
            // authorization check : ensure user is authorized to create a question
            if (!req.user || req.user.role !== 'admin') { //  authorization (only admin can create questions)
                return res.status(403).json({ success: false, error: 'Unauthorized access.' });
            }
    
            const { question, topicId, correctAnswer } = req.body;
            if (
                typeof question !== 'string' || !question.trim() ||
               !mongoose.Types.ObjectId.isValid(topicId) ||
               typeof correctAnswer !== 'string' || !correctAnswer.trim()
                        ) {
                            return res.status(400).json({ success: false, error: 'Invalid input types.'});
                        }            
            // logic to create a new question
            const newQuestion = await Question.create({ question, topicId, correctAnswer });
            res.status(201).json({ success: true, newQuestion });
        } catch (error) {
            console.error('Error creating question', error);
            res.status(500).json({ success: false, error: 'Failed to create question.' });
        }
    };

    const deleteQuestion = async (req, res) => {
        try {
            const { id } = req.params;
                if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ success: false, error: 'Unauthorized access.' });
            }
    
            const deletedQuestion = await Question.findByIdAndDelete(id);
            if (!deletedQuestion) {
                return res.status(404).json({ success: false, error: 'Question not found.' });
            }
            res.status(200).json({ success: true, message: `Question ${id} deleted successfully!` });
        } catch (error) {
            console.error(`[DELETE QUESTION ERROR] ID: ${id} ${error.message}`); 
            res.status(500).json({ success: false, error: 'Failed to delete question.' });
        }
    };

    module.exports = {
        getQuestion,
        submitAnswer, 
        createQuestion, 
        updateQuestion, 
        deleteQuestion
    };