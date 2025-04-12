const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Question = require('../models/InterviewQuestion'); // Related questions

// POST /api/topics
const createTopic = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input - if name provided and a string

        // Check if name is just empty or whitespace
        if (!name.trim()) {
            return res.status(400).json({ success: false, error: 'Topic name cannot be empty.' });
        }

        if (typeof name !== 'string') {
            return res.status(400).json({ success: false, error: 'Topic name must be a string.' });
        }
        
        if (!name.trim()) {
            return res.status(400).json({ success: false, error: 'Topic name cannot be just whitespace. '});
        }
        // Check for duplicate name
            const existingTopic = await Topic.findOne({ name });
                if (existingTopic) {
                    return res.status(400).json({ success: false, error: 'A topic with that name already exists. '});
                }

        // Validate description if provided
        if (description !== undefined && typeof description !== 'string') {
            return res.status(400).json({ success: false, error: 'Description must be a string.'});
        } 

        // Proceed with creation if validation passes
        const topicDescription = description && typeof description === 'string' ? description.trim() : null;
        const newTopic = await Topic.create({ name, description: topicDescription });

        res.status(201).json({ success: true, data: newTopic });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ success: false, error: error.message });
        }
    };


// GET /api/topics
const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find()
        .populate('interviewQuestions')
        .populate('anagrams');
        if (topics.length === 0) { 
            return res.status(404).json({ success: false, error: 'No topics found.' });
        }
        res.status(200).json({ success: true, data: topics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/topics/:id
const getTopicById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ success: false, error: 'Invalid topic ID format.' });
        }

        const topic = await Topic.findById(id);
        if (!topic) { 
            return res.status(404).json({ success: false, error: 'Topic not found.' });
        }
        res.status(200).json({ success: true, data: topic });
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /api/topics/:id
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        let errors = [];

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) { 
           errors.push({ field: 'id', message: "Invalid topic ID."});
        }
        if (!name) {
            errors.push({ field: 'name', message: 'Topic name cannot be empty.' });
        } else if (typeof name !== 'string' || !name.trim()) {
            errors.push({ field: 'name', message: 'Invalid topic name: must be a non-empty string.' });
       
        if (description && typeof description !== 'string') {
            errors.push({ field: 'description', message: 'Invalid description: must be a string. '});
        }

        // If there are validation errors, return them
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });

        }
    }

        // Proceed with update if no errors
        const updatedTopic = await Topic.findByIdAndUpdate(
            id, 
            { name, description },
            { new: true, runValidators: true }
        );
        if (!updatedTopic) {
            return res.status(404).json({ success: false, error: 'Topic not found.' });
        }
        res.status(200).json({ success: true, data: updatedTopic });
    } catch (error) {
        console.error(`Error updating topic ID: ${id}`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};


// DELETE /api/topics/:id
const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { cascade = true } = req.query;

        console.log(`Attempting to delete topic with ID: ${id}, cascade: ${cascade}`);

        // Check if the ID format is valid
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid topic ID. '});
        }

        // Find topic first to ensure it exists
        const topic = await Topic.findById(id);
        if(!topic) {
            return res.status(404).json({ success: false, error: 'Topic not found. '});
        }

        let details = {}; // store details about deletions

        // If cascading delete is enabled, delete related questions
        if (cascade) {
            const deleteResult = await Question.deleteMany({ topic: id });
            details.questionsDeleted = deleteResult.deletedCount; // How many questions were deleted
        }

        // Delete the topic
        const deletedTopic = await Topic.findByIdAndDelete(id);
        if (!deletedTopic) {
            return res.status(404).json({ success: false, error: 'Topic not found.' });
        }

        details.message = 'Topic deleted successfully!';
        res.status(200).json({ success: true, message: 'Topic deleted successfully!', details });
    } catch (error) {
        console.error(`Error deleting topic ID: ${id}`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};
