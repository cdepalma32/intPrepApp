const getQuestion = async (req, res) => {
    try {
        const { topicId } = req.params;
        // logic to fetch questions for the topic
        const questions = await Question.find({ topicId }); 
        if (!questions || questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this topic.'});
        }
        res.status(200).json({ message: `Questions for topic ${topicId} fetched successfully!`, questions});
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch interview questions.'})
    }
    };

const submitAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { answer } = req.body;
        // authentication check : ensure user is authenticated
        if (!req.user) { // assuming 'req.user' is set by a middleware for JWT
            return res.status(401).json({ error: 'User not authenticated!'});
        }
        // authorization check : ensure user is authorized to submit answer
        const question = await Question.findById(questionId); 
        if (!question) {
            return res.status(404).json({ error: 'Question not found!'});
        }
        if (req.user.role !== 'student') {
            return res.status(403).json({ error: 'You are not authorized to submit an answer.'})
        }
                // check if correctAnswer exists and is a string
                if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {  
                    return res.status(400).json({ error: 'Correct answer is not properly set for this question.' }); 
                }
            // normalize answer to lowercaes for comparison
            const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

        // logic to submit an answer
        res.status(200).json({ message: `Answer for question ${questionId} submitted successfully!`, isCorrect });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ error: 'Failed to submit answer.'});
    }
    };
    // handles edge cases and provides feedback (client, dev) in case of misconfig.

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, topicId, correctAnswer } = req.body;
        // authentication check : ensure user is authenticate
        
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated!'});
        }
        // authorization check : ensure user is authorized to update a question
        if (req.user.role !== 'admin') {
            return res.status(403).json({error: 'You are not authorized to update this question.'});
        }
        // validate the required fields in the request body // checks if they are all present in request body, if not, returns a 400 status + error message
        if ( !question || !topicId || !correctAnswer ) {
            return res.status(400).json({error: 'Missing required fields (question, topicId, or correctAnswer '});
        }
        // logic to update a question
        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true});
        if (!updatedQuestion) {
            return res.status(404).json({error: 'Question not found.'});
        }
        res.status(200).json({ message: `Interview question ${id} updated successfully!`, updatedQuestion });
    } catch (error) {
        console.error('Error updating question', error);
        res.status(500).json({ error: 'Failed to update interview question.'});
    }
    };

    const createQuestion = async (req, res) => {
        try {
            // authentication check : ensure user is authenticated 
            if (!req.user) { // assuming `req.user` is set by a middleware for JWT
                return res.status(401).json({ error: 'User not authenticated!' }); //  authentication
            }
    
            // authorization check : ensure user is authorized to create a question
            if (req.user.role !== 'admin') { //  authorization (only admin can create questions)
                return res.status(403).json({ error: 'You are not authorized to create a question.' });
            }
    
            const { question, topicId, correctAnswer } = req.body;
            // logic to create a new question
            const newQuestion = await Question.create({ question, topicId, correctAnswer });
            res.status(201).json({ message: 'Question created successfully!', newQuestion });
        } catch (error) {
            console.error('Error creating question', error);
            res.status(500).json({ error: 'Failed to create question.' });
        }
    };

    const deleteQuestion = async (req, res) => {
        try {
            const { id } = req.params;
    
            // authentication check : ensure user is authenticated 
            if (!req.user) { // assuming `req.user` is set by a middleware for JWT
                return res.status(401).json({ error: 'User not authenticated!' }); // authentication
            }
    
            // authorization check : ensure user is authorized to delete a question
            if (req.user.role !== 'admin') { //  authorization (only admin can delete questions)
                return res.status(403).json({ error: 'You are not authorized to delete this question.' });
            }
    
            const deletedQuestion = await Question.findByIdAndDelete(id);
            if (!deletedQuestion) {
                return res.status(404).json({ error: 'Question not found.' });
            }
    
            // logic to delete a question
            res.status(200).json({ message: `Interview question ${id} deleted successfully!` });
        } catch (error) {
            console.error('Error deleting question', error);
            res.status(500).json({ error: 'Failed to delete interview question.' });
        }
    };

    module.exports = {
        getQuestion,
        submitAnswer, 
        createQuestion, 
        updateQuestion, 
        deleteQuestion
    };