const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Question = require('../models/InterviewQuestion'); // Related questions

// POST /api/topics
const createTopic = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (typeof name !== 'string' || !name.trim()) { 
            return res.status(400).json({ success: false, error: 'Topic name is required and must be a string.' });
        }

        const newTopic = await Topic.create({ name, description });
        res.status(201).json({ success: true, data: newTopic });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/topics
const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find();
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
            return res.status(400).json({ success: false, error: 'Invalid topic ID.' });
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

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ success: false, error: 'Invalid topic ID.' });
        }
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Invalid topic name.' });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ success: false, error: 'Invalid description.' });
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ success: false, error: 'Invalid topic ID.' });
        }

        if (cascade) {
            console.log(`Cascading delete for topic ID: ${id}`);
            await Question.deleteMany({ topic: id });
        }

        const deletedTopic = await Topic.findByIdAndDelete(id);
        if (!deletedTopic) {
            return res.status(404).json({ success: false, error: 'Topic not found.' });
        }
        res.status(200).json({ success: true, message: 'Topic deleted successfully!' });
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
